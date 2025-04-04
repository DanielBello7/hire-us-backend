import { DatabaseModule } from '@app/database';
import { ExamsService } from './exams.service';
import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { OptionsModule } from 'src/options/options.module';
import { ResponseModule } from 'src/response/response.module';
import { ProgressModule } from 'src/progress/progress.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [ExamsService],
    controllers: [ExamsController],
    exports: [ExamsService],
    imports: [
        DatabaseModule,
        OptionsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        QuestionsModule,
        ResponseModule,
        ProgressModule,
    ],
})
export class ExamsModule {}
