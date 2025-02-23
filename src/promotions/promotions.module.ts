import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from '@app/database';

@Module({
    controllers: [PromotionsController],
    imports: [DatabaseModule],
    providers: [PromotionsService],
    exports: [PromotionsService],
})
export class PromotionsModule {}
