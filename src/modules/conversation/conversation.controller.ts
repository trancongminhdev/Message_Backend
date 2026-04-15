import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateNewConversationRequest } from './dto/create-new-conversation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilterOptions } from 'types/filterOption.dto';

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
  async getListConversation(@Req() req, @Query() query:FilterOptions) {
    const user = req.user;
    return this.conversationService.getListConversation(user, query)
  }
}
