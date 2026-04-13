import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ required: true, default: 'tranminh209204@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, default: '123456' })
  @IsString()
  password: string;
}
