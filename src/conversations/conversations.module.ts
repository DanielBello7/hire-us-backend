import { ConversationsController } from './conversations.controller';
import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { DatabaseModule } from '@app/database';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    controllers: [ConversationsController],
    exports: [ConversationsService],
    imports: [DatabaseModule, MessagesModule],
    providers: [ConversationsService],
})
export class ConversationsModule {}
