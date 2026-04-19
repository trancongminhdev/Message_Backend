import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckConversationRequest {
  @ApiProperty()
  @IsString()
  idConversation: number;
}
