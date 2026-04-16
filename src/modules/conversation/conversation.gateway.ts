import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { SUBCRIBE_MESSAGE } from 'types/constant/message.constant';
import { SendMessageRequest } from './dto/send-message.dto';
import { MessageService } from '../message/message.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // production thì nên giới hạn domain
  },
})
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage(SUBCRIBE_MESSAGE.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() message: SendMessageRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const accessToken = client.handshake.auth.token;

    const newMessage = await this.messageService.create(accessToken, message);
    return newMessage;
  }

  @SubscribeMessage(SUBCRIBE_MESSAGE.JOIN_CONVERSATION)
  async joinConversation(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }
}
