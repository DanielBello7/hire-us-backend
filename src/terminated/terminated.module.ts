import { Module } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { TerminatedController } from './terminated.controller';
import { DatabaseModule } from '@app/database';

@Module({
    controllers: [TerminatedController],
    imports: [DatabaseModule],
    providers: [TerminatedService],
    exports: [TerminatedService],
})
export class TerminatedModule {}
