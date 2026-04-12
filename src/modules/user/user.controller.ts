import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewUserRequest } from './dto/create-new-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  @Post()
  create(@Body() body: CreateNewUserRequest) {}
}
