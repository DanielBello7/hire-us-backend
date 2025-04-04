import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseModule } from '@app/database';
import { OptionsModule } from 'src/options/options.module';

@Module({
    controllers: [QuestionsController],
    exports: [QuestionsService],
    providers: [QuestionsService],
    imports: [DatabaseModule, OptionsModule],
})
export class QuestionsModule {}
