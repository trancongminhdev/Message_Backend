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
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // production thì nên giới hạn domain
  },
})
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket) {
    const accessToken = client.handshake.auth.token;
    const user: User = await this.jwtService.verify(accessToken);
    await this.userService.updateIsOnlineUser(user.id, true);
  }

  async handleDisconnect(client: Socket) {
    const accessToken = client.handshake.auth.token;
    const user: User = await this.jwtService.verify(accessToken);

    await this.userService.updateIsOnlineUser(user.id, false);
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
    console.log('roomId', roomId);
    
    client.join(roomId);
  }
}
