import { Module } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { TerminatedController } from './terminated.controller';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
    controllers: [TerminatedController],
    providers: [TerminatedService],
    imports: [DatabaseModule],
    exports: [TerminatedService],
})
export class TerminatedModule {}
