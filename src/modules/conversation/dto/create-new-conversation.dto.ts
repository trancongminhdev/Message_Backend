import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateNewConversationRequest {
  @ApiProperty()
  @IsArray()
  @IsNumber()
  members: number[];
}
