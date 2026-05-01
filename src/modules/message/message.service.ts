import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Message } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { HTTP_RESPONSE } from 'types/constant/api.constant';
import { EVENTS } from 'types/constant/event.constant';
import { FilterOptions } from 'types/filterOption.dto';
import { IResponse, IResponseListData } from 'types/interface/api.interface';
import { ConversationService, IUserConversationLastMessage } from '../conversation/conversation.service';
import { UserService } from '../user/user.service';
import { CreateNewMessageRequest } from './dto/create-new-message.dto';
import { UpdateStatusMessageRequest } from './dto/update-status-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async create(
    accessToken: string,
    data: CreateNewMessageRequest,
  ): Promise<IResponse<Message | null>> {
    const { id: idUser } = await this.jwtService.verify(accessToken);
    const { idReceiver, message } = data;

    const user = await this.userService.findById(idUser);
    if (!user) throw new NotFoundException('User is not found');

    if (!idReceiver && !message)
      throw new ConflictException('idReceiver, message is required');

    const payloadConversation = {
      members: [idUser, idReceiver],
    };

    const conversation = await this.conversationService.findConversation([
      idUser,
      idReceiver,
    ]);

    if (conversation) {
      //Tồn tại conversation
      const payloadMessage = {
        idConversation: conversation.id,
        userSend: idUser,
        message: message,
      };

      const newMessage = await this.prisma.message.create({
        data: payloadMessage,
      });

      const conversationLastMessage:IUserConversationLastMessage = {
        ...conversation,
        user: user,
        message: newMessage,
      };

      await this.eventEmitter.emit(EVENTS.SEND_MESSAGE, idReceiver, conversationLastMessage);

      return HTTP_RESPONSE.OK(newMessage);
    } else {
      //Chưa tồn tại conversation
      const conversation =
        await this.conversationService.create(payloadConversation);

      const payloadMessage = {
        idConversation: conversation.id,
        userSend: idUser,
        message: message,
      };

      const newMessage = await this.prisma.message.create({
        data: payloadMessage,
      });

      const conversationLastMessage:IUserConversationLastMessage = {
        ...conversation,
        user: user,
        message: newMessage,
      };

      await this.eventEmitter.emit(EVENTS.SEND_MESSAGE_FRIST, idReceiver, conversationLastMessage);

      return HTTP_RESPONSE.OK(newMessage);
    }
  }

  async getListMessages(
    idConversation: string,
    query: FilterOptions,
  ): Promise<IResponseListData<Message>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    if (isNaN(Number(idConversation)))
      throw new ConflictException('ID Receiver is Number');

    const conversation = await this.conversationService.findById(
      Number(idConversation),
    );

    if (!conversation) throw new NotFoundException('Conversation is not found');

    const [items, total] = await Promise.all([
      await this.prisma.message.findMany({
        where: { idConversation: Number(idConversation) },
        skip,
        take: pageSize,
        orderBy: { createAt: 'asc' },
      }),
      this.prisma.message.count({
        where: { idConversation: Number(idConversation) },
      }),
    ]);

    const totalPage = Math.ceil(total / pageSize);
    const nextPage = page < totalPage;
    const previousPage = page > 1;

    return HTTP_RESPONSE.OK({
      items: items,
      pagination: {
        page,
        pageSize,
        total: total,
        totalPage,
        nextPage,
        previousPage,
      },
    });
  }

  async findLastMessageByIdConversation(idConversation: number) {
    return await this.prisma.message.findFirst({
      where: { idConversation },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async updateStatusMessage(
    idMessage: string,
    data: UpdateStatusMessageRequest,
  ) {
    return await this.prisma.message.update({
      data: data,
      where: { id: Number(idMessage) },
    });
  }
}
