import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
    providers: [ReviewsService],
    imports: [DatabaseModule],
    controllers: [ReviewsController],
    exports: [ReviewsService],
})
export class ReviewsModule {}
