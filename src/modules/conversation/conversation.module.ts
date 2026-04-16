import { forwardRef, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { ConversationController } from './conversation.controller';
import { ConversationGateway } from './conversation.gateway';
import { ConversationListener } from './conversation.listener';
import { ConversationService } from './conversation.service';

@Module({
  imports: [forwardRef(() => MessageModule), forwardRef(() => UserModule)],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway, ConversationListener],
  exports: [ConversationService],
})
export class ConversationModule {}
