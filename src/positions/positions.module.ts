import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '@app/database';

@Module({
    providers: [PositionsService],
    imports: [DatabaseModule],
    controllers: [PositionsController],
    exports: [PositionsService],
})
export class PositionsModule {}
