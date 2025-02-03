import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    controllers: [PromotionsController],
    providers: [PromotionsService],
    imports: [DatabaseModule],
    exports: [PromotionsService],
})
export class PromotionsModule {}
