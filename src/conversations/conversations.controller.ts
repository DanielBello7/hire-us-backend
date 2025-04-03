import {
    Controller,
    Get,
    Delete,
    Post,
    Param,
    Body,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversations: ConversationsService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.conversations.findConversations(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conversations.findOneUsingId(id);
    }

    @UseGuards(SessionGuard)
    @Get(':id/messages/')
    findMessages(@Param('id', ParseIntPipe) id: number) {
        return this.conversations.findMessages(id);
    }

    @UseGuards(SessionGuard)
    @Post()
    create(@Body() body: CreateConversationDto) {
        return this.conversations.createConversation(body);
    }

    @UseGuards(SessionGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.conversations.deleteConversation(id);
    }
}
