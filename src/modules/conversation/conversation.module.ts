import { forwardRef, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ConversationController } from './conversation.controller';
import { ConversationGateway } from './conversation.gateway';
import { ConversationListener } from './conversation.listener';
import { ConversationService } from './conversation.service';

@Module({
  imports: [forwardRef(() => MessageModule)],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway, ConversationListener],
  exports: [ConversationService],
})
export class ConversationModule {}
