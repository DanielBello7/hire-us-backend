import { ProgressController } from './progress.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [ProgressService],
    controllers: [ProgressController],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    exports: [ProgressService],
})
export class ProgressModule {}
