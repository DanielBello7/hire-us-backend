import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { ExamsModule } from 'src/exams/exams.module';
import { OptionsModule } from 'src/options/options.module';

@Module({
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService],
    imports: [DatabaseModule, ExamsModule, OptionsModule],
})
export class QuestionsModule {}
