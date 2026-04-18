import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SUBCRIBE_MESSAGE } from 'types/constant/message.constant';
import { MessageService } from '../message/message.service';
import { SendMessageRequest } from './dto/send-message.dto';

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
