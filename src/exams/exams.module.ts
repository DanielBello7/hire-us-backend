import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    providers: [ExamsService],
    controllers: [ExamsController],
    exports: [ExamsService],
    imports: [DatabaseService],
})
export class ExamsModule {}
