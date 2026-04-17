import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNewMessageRequest } from './dto/create-new-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilterOptions } from 'types/filterOption.dto';

@ApiTags('Message')
@Controller('message')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send-message')
  async create(@Req() req, @Body() body: CreateNewMessageRequest) {
    const user = req.user;
    return this.messageService.create(user, body);
  }

  @Get('get-list-messages/:id')
  async getListMessages(
    @Req() req,
    @Param('id') idConversation: string,
    @Query() query: FilterOptions,
  ) {
    const user = req.user;
    return this.messageService.getListMessages(user, idConversation, query);
  }
}
