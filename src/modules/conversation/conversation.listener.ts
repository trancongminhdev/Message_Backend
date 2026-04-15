import { Injectable } from '@nestjs/common';
import { ConversationGateway } from './conversation.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'types/constant/event.constant';
import { Conversation, Message } from '@prisma/client';
import { SUBCRIBE_MESSAGE } from 'types/constant/message.constant';

@Injectable()
export class ConversationListener {
  constructor(private conversationGateway: ConversationGateway) {}

  @OnEvent(EVENTS.SEND_MESSAGE)
  sendMessage(payload: { conversation: Conversation; message: Message }) {
    const { conversation, message } = payload;
    this.conversationGateway.server
      .to(conversation.id.toString())
      .emit(SUBCRIBE_MESSAGE.SEND_MESSAGE, message);
    // this.conversationGateway.server
    //   .to(conversation.id.toString())
    //   .emit(SUBCRIBE_MESSAGE.JOIN_CONVERSATION, conversation);
  }

  @OnEvent(EVENTS.SEND_MESSAGE_FRIST)
  sendMessageFrist(payload: {
    senderId;
    receiverId;
    conversation: Conversation;
    message: Message;
  }) {
    const { receiverId, senderId, conversation, message } = payload;
    this.conversationGateway.server
      .to(senderId)
      .emit(SUBCRIBE_MESSAGE.JOIN_CONVERSATION_FRIST, conversation);
    this.conversationGateway.server
      .to(receiverId)
      .emit(SUBCRIBE_MESSAGE.JOIN_CONVERSATION_FRIST, conversation);

    this.conversationGateway.server
      .to(senderId)
      .emit(SUBCRIBE_MESSAGE.SEND_MESSAGE, message);
    this.conversationGateway.server
      .to(receiverId)
      .emit(SUBCRIBE_MESSAGE.SEND_MESSAGE, message);
  }
}
