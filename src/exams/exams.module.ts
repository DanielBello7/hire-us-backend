import { DatabaseModule } from '@app/common/database/database.module';
import { ExamsService } from './exams.service';
import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { OptionsModule } from 'src/options/options.module';

@Module({
    providers: [ExamsService],
    controllers: [ExamsController],
    exports: [ExamsService],
    imports: [DatabaseModule, QuestionsModule, OptionsModule],
})
export class ExamsModule {}
