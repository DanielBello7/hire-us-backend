import { ProgressController } from './progress.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Module({
    providers: [ProgressService],
    controllers: [ProgressController],
    imports: [DatabaseModule],
    exports: [ProgressService],
})
export class ProgressModule {}
