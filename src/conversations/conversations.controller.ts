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
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.conversationsService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id/messages/')
    findMessages(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findMessages(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Post()
    create(@Body() body: CreateConversationDto) {
        return this.conversationsService.createConversation(body);
    }

    @UseGuards(PassprtJWTGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.remove(id);
    }
}
