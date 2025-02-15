import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
    controllers: [ResponseController],
    exports: [ResponseService],
    imports: [DatabaseModule, ProgressModule],
    providers: [ResponseService],
})
export class ResponseModule {}
