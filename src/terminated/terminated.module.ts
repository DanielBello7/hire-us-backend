import { Module } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { TerminatedController } from './terminated.controller';

@Module({
  controllers: [TerminatedController],
  providers: [TerminatedService],
})
export class TerminatedModule {}
