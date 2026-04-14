import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // production thì nên giới hạn domain
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Message from client:', data);

    // broadcast cho tất cả client
    client.broadcast.emit('receiveMessage', data);

    return { status: 'ok' };
  }
}
