import { ExamStatusController } from './exam-status.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { ExamStatusService } from './exam-status.service';

@Module({
    providers: [ExamStatusService],
    controllers: [ExamStatusController],
    imports: [DatabaseModule],
    exports: [ExamStatusService],
})
export class ExamStatusModule {}
