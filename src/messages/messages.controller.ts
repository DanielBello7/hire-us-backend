import {
    ParseIntPipe,
    Controller,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @UseGuards(SessionGuard)
    @Post()
    create(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body);
    }

    @UseGuards(SessionGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.messagesService.remove(+id);
    }
}
