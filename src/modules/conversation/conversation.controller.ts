import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilterOptions } from 'types/filterOption.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateNewConversationRequest } from './dto/create-new-conversation.dto';
import { GetListUserConversationRequest } from './dto/get-list-user-conversation.dto';
import { CheckConversationRequest } from './dto/check-conversation.dto';

@Controller('conversation')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create-new-conversation')
  async create(@Body() body: CreateNewConversationRequest) {
    return this.conversationService.create(body);
  }

  @Get('get-list-conversation')
  async getListConversation(@Req() req, @Query() query: FilterOptions) {
    const user = req.user;
    return this.conversationService.getListConversation(user, query);
  }

  @Get('get-list-user-conversation')
  async getListUserConversation(
    @Req() req,
    @Query() query: GetListUserConversationRequest,
  ) {
    const user = req.user;
    return this.conversationService.getListUserConversation(user, query);
  }

  @Post('check-conversation')
  async checkConversation(
    @Req() req,
    @Body() body: CheckConversationRequest,
  ) {
    const user = req.user;
    return this.conversationService.checkConversation(user, body);
  }
}
