import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [PositionsController],
    providers: [PositionsService],
    imports: [DatabaseService],
    exports: [PositionsService],
})
export class PositionsModule {}
