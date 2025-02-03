import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [ConversationsController],
    providers: [ConversationsService],
    imports: [DatabaseService],
    exports: [ConversationsService],
})
export class ConversationsModule {}
