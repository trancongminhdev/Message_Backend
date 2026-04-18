import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateNewUserRequest } from './dto/create-new-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetListUser } from './dto/get-list-user.dto';
import { GetListUserConversationRequest } from '../conversation/dto/get-list-user-conversation.dto';
import { IUserJWT } from 'types/interface/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-new-user')
  async createNewUser(@Body() body: CreateNewUserRequest) {
    return this.userService.createNewUser(body);
  }

  @Get('get-list-user')
  async getListUser(@Query() query: GetListUser) {
    return this.userService.getListUser(query);
  }

  @Get('get-user-by-id/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
