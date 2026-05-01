import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Conversation, Message } from '@prisma/client';
import { EVENTS } from 'types/constant/event.constant';
import { SUBCRIBE_MESSAGE } from 'types/constant/message.constant';
import { ConversationGateway } from './conversation.gateway';
import { IUserConversationLastMessage } from './conversation.service';

@Injectable()
export class ConversationListener {
  constructor(private conversationGateway: ConversationGateway) {}

  @OnEvent(EVENTS.SEND_MESSAGE)
  sendMessage(payload: { conversation: Conversation; message: Message }) {
    const { conversation, message } = payload;
    this.conversationGateway.server
      .to(conversation.id.toString())
      .emit(SUBCRIBE_MESSAGE.RECEIVE_MESSAGE_CONVERSATION, message);
    // this.conversationGateway.server
    //   .to(conversation.id.toString())
    //   .emit(SUBCRIBE_MESSAGE.JOIN_CONVERSATION, conversation);
  }

  @OnEvent(EVENTS.SEND_MESSAGE_FRIST)
  sendMessageFrist(
    idReceiver: number,
    conversation: IUserConversationLastMessage,
  ) {
    const { user, message } = conversation;
    // console.log('idReceiver', idReceiver);
    // console.log('conversation', conversation);

    //Update conversation
    this.conversationGateway.server
      .to(user.id.toString())
      .emit(SUBCRIBE_MESSAGE.ADD_NEW_CONVERSATION, conversation);
    this.conversationGateway.server
      .to(idReceiver.toString())
      .emit(SUBCRIBE_MESSAGE.ADD_NEW_CONVERSATION, conversation);

    // Gửi message
    this.conversationGateway.server
      .to(user.id.toString())
      .emit(SUBCRIBE_MESSAGE.RECEIVE_MESSAGE_USER, message);
    this.conversationGateway.server
      .to(idReceiver.toString())
      .emit(SUBCRIBE_MESSAGE.RECEIVE_MESSAGE_USER, message);
  }
}
