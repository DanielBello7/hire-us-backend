import {
    Controller,
    Get,
    Delete,
    Post,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Get()
    findAll() {
        return this.conversationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findOne(id);
    }

    @Get(':id/messages')
    findMessages(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.findMessages(id);
    }

    @Post()
    create(@Body() createConversationDto: CreateConversationDto) {
        return this.conversationsService.create(createConversationDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.conversationsService.remove(id);
    }
}
