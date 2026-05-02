import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'types/constant/event.constant';
import { SUBCRIBE_MESSAGE } from 'types/constant/message.constant';
import { ConversationGateway } from './conversation.gateway';
import { IUserConversationLastMessage } from './conversation.service';

@Injectable()
export class ConversationListener {
  constructor(private conversationGateway: ConversationGateway) {}

  @OnEvent(EVENTS.SEND_MESSAGE)
  sendMessage(conversationLastMessage: IUserConversationLastMessage) {
    const { user, message, ...conversation } = conversationLastMessage;
    
    this.conversationGateway.server
      .to(conversation.id.toString())
      .emit(SUBCRIBE_MESSAGE.RECEIVE_MESSAGE_CONVERSATION, message);
  }

  @OnEvent(EVENTS.SEND_MESSAGE_FRIST)
  sendMessageFrist(
    idReceiver: number,
    conversation: IUserConversationLastMessage,
  ) {
    const { user } = conversation;

    //navidation conversation
    this.conversationGateway.server
      .to(user.id.toString())
      .emit(SUBCRIBE_MESSAGE.SOCKET_NAVIGATION, conversation);

    //add new conversation
    this.conversationGateway.server
      .to(idReceiver.toString())
      .emit(SUBCRIBE_MESSAGE.ADD_NEW_CONVERSATION, conversation);
  }
}
