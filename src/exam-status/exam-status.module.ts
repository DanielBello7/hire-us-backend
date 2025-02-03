import { Module } from '@nestjs/common';
import { ExamStatusService } from './exam-status.service';
import { ExamStatusController } from './exam-status.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    providers: [ExamStatusService],
    controllers: [ExamStatusController],
    imports: [DatabaseService],
    exports: [ExamStatusService],
})
export class ExamStatusModule {}
