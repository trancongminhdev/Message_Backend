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
import { IUserJWT } from 'types/interface/user.interface';
import { ConversationService } from '../conversation/conversation.service';
import { CreateNewMessageRequest } from './dto/create-new-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    accessToken: string,
    data: CreateNewMessageRequest,
  ): Promise<IResponse<Message | null>> {
    const { id: idUser } = await this.jwtService.verify(accessToken);
    const { idReceiver, message } = data;
    
    if (!idReceiver && !message)
      throw new ConflictException('idReceiver, message is required');

    const payloadConversation = {
      members: [idUser, idReceiver],
    };

    const conversationExists = await this.conversationService.findConversation([
      idUser,
      idReceiver,
    ]);

    if (conversationExists) {
      //Chưa tồn tại conversation
      const payloadMessage = {
        idConversation: conversationExists.id,
        userSend: idUser,
        message: message,
      };

      const newMessage = await this.prisma.message.create({
        data: payloadMessage,
      });

      const payload = {
        conversation: conversationExists,
        message: newMessage,
      };

      await this.eventEmitter.emit(EVENTS.SEND_MESSAGE, payload);

      return HTTP_RESPONSE.OK(newMessage);
    } else {
      //Tồn tại conversation
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

      const payload = {
        senderId: idReceiver,
        receiverId: idReceiver,
        conversation: conversationExists,
        message: newMessage,
      };

      await this.eventEmitter.emit(EVENTS.SEND_MESSAGE_FRIST, payload);

      return HTTP_RESPONSE.OK(newMessage);
    }
  }

  async getListMessages(
    user: IUserJWT,
    idReceiver: string,
    query: FilterOptions,
  ): Promise<IResponseListData<Message>> {
    const { idUser } = user;

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    if (isNaN(Number(idReceiver)))
      throw new ConflictException('ID Receiver is Number');

    const conversation = await this.conversationService.findConversation([
      idUser,
      Number(idReceiver),
    ]);

    if (!conversation) throw new NotFoundException('Conversation is not found');

    const [items, total] = await Promise.all([
      await this.prisma.message.findMany({
        where: { idConversation: conversation.id },
        skip,
        take: pageSize,
        orderBy: { createAt: 'desc' },
      }),
      this.prisma.message.count({
        where: { idConversation: conversation.id },
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
}
