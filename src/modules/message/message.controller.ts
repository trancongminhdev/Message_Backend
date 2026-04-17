import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterOptions } from 'types/filterOption.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNewMessageRequest } from './dto/create-new-message.dto';
import { UpdateStatusMessageRequest } from './dto/update-status-message.dto';
import { MessageService } from './message.service';

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
    @Param('id') idConversation: string,
    @Query() query: FilterOptions,
  ) {
    return this.messageService.getListMessages(idConversation, query);
  }

  @Patch('update-status-message/:id')
  async updateSatusMessage(@Param('id') idMessage: string, @Body() body:UpdateStatusMessageRequest) {
    return this.messageService.updateStatusMessage(idMessage, body);
  }
}
