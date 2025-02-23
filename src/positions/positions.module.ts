import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '@app/database';

@Module({
    controllers: [PositionsController],
    providers: [PositionsService],
    imports: [DatabaseModule],
    exports: [PositionsService],
})
export class PositionsModule {}
