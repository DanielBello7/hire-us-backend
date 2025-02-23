import { ConversationsController } from './conversations.controller';
import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { DatabaseModule } from '@app/database';

@Module({
    controllers: [ConversationsController],
    exports: [ConversationsService],
    imports: [DatabaseModule],
    providers: [ConversationsService],
})
export class ConversationsModule {}
