import { Module } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { TerminatedController } from './terminated.controller';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [TerminatedController],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [TerminatedService],
    exports: [TerminatedService],
})
export class TerminatedModule {}
