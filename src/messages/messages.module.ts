import { MessagesController } from './messages.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Module({
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
    imports: [DatabaseModule],
})
export class MessagesModule {}
