import { forwardRef, Module } from '@nestjs/common';
import { ConversationController } from '../conversation/conversation.controller';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [forwardRef(() => ConversationModule)],
  controllers: [MessageController, ConversationController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
