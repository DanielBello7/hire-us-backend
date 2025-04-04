import { ConversationsController } from './conversations.controller';
import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { DatabaseModule } from '@app/database';
import { MessagesModule } from 'src/messages/messages.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [ConversationsController],
    exports: [ConversationsService],
    imports: [
        DatabaseModule,
        MessagesModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [ConversationsService],
})
export class ConversationsModule {}
