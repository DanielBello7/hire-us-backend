import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
    controllers: [QuestionsController],
    imports: [DatabaseModule],
    providers: [QuestionsService],
    exports: [QuestionsService],
})
export class QuestionsModule {}
