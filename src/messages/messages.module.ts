import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
    imports: [DatabaseService],
})
export class MessagesModule {}
