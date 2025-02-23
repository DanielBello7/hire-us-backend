import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseModule } from '@app/database';
import { ExamsModule } from 'src/exams/exams.module';
import { OptionsModule } from 'src/options/options.module';

@Module({
    controllers: [QuestionsController],
    exports: [QuestionsService],
    providers: [QuestionsService],
    imports: [DatabaseModule, ExamsModule, OptionsModule],
})
export class QuestionsModule {}
