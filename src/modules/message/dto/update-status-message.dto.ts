import { ApiProperty } from '@nestjs/swagger';
import { STATUS_MESSAGE } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusMessageRequest {
  @ApiProperty()
  @IsEnum(STATUS_MESSAGE)
  status: STATUS_MESSAGE;
}
