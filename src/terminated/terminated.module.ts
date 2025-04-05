import { Module } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { TerminatedController } from './terminated.controller';
import { DatabaseModule } from '@app/database';

@Module({
    imports: [DatabaseModule],
    controllers: [TerminatedController],
    exports: [TerminatedService],
    providers: [TerminatedService],
})
export class TerminatedModule {}
