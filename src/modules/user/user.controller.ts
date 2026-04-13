import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewUserRequest } from './dto/create-new-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-new-user')
  async createNewUser(@Body() body: CreateNewUserRequest) {
    return this.userService.createNewUser(body);
  }
}
