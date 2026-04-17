import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNewConversationRequest } from './dto/create-new-conversation.dto';
import { IUserJWT } from 'types/interface/user.interface';
import { FilterOptions } from 'types/filterOption.dto';
import { HTTP_RESPONSE } from 'types/constant/api.constant';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(data: CreateNewConversationRequest): Promise<Conversation> {
    return await this.prisma.conversation.create({ data });
  }

  async findById(id: number) {
    return await this.prisma.conversation.findUnique({
      where: { id },
    });
  }

  async findConversation(members: number[]) {
    const sortedMembers = [...members].sort();

    return await this.prisma.conversation.findFirst({
      where: {
        members: {
          hasEvery: sortedMembers,
        },
      },
    });
  }

  async getListConversation(user: IUserJWT, query: FilterOptions) {
    const { idUser } = user;

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      await this.prisma.conversation.findMany({
        where: {
          members: {
            has: idUser,
          },
        },
        skip,
        take: pageSize,
        orderBy: { createAt: 'desc' },
      }),
      await this.prisma.conversation.count({
        where: {
          members: {
            has: idUser,
          },
        },
      }),
    ]);

    const userAndConversations = await Promise.all(
      items.flatMap(async (item) => {
        const idReceiver = item.members.filter((member) => member != idUser);
        const user = await this.userService.findById(idReceiver[0]);
        const message =
          await this.messageService.findLastMessageByIdConversation(item.id);

        return {
          ...item,
          user,
          message,
        };
      }),
    );

    const totalPage = Math.ceil(total / pageSize);
    const nextPage = page < totalPage;
    const previousPage = page > 1;

    return HTTP_RESPONSE.OK({
      items: userAndConversations,
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
}
