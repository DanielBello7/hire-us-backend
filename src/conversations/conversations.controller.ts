import {
    Controller,
    Get,
    Delete,
    Post,
    Param,
    Body,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.conversationsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findOne(id);
    }

    @Get(':id/messages/')
    findMessages(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findMessages(id);
    }

    @Post()
    create(@Body() body: CreateConversationDto) {
        return this.conversationsService.createConversation(body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.remove(id);
    }
}
