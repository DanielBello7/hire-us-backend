import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [PromotionsController],
    providers: [PromotionsService],
    imports: [DatabaseService],
    exports: [PromotionsService],
})
export class PromotionsModule {}
