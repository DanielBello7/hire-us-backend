import {
    ParseIntPipe,
    Controller,
    Post,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    create(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.messagesService.remove(+id);
    }
}
