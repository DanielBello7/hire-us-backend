import { DatabaseModule } from '@app/common/database/database.module';
import { ExamsService } from './exams.service';
import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';

@Module({
    providers: [ExamsService],
    controllers: [ExamsController],
    exports: [ExamsService],
    imports: [DatabaseModule],
})
export class ExamsModule {}
