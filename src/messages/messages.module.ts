import { MessagesController } from './messages.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UploadsModule } from 'src/uploads/uploads.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [MessagesController],
    exports: [MessagesService],
    providers: [MessagesService],
    imports: [
        DatabaseModule,
        UploadsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
})
export class MessagesModule {}
