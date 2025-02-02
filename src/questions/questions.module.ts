import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [QuestionsController],
    providers: [QuestionsService],
    imports: [DatabaseService],
    exports: [QuestionsService],
})
export class QuestionsModule {}
