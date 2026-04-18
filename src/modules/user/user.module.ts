import { forwardRef, Module } from '@nestjs/common';
import { ConversationModule } from '../conversation/conversation.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => ConversationModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
