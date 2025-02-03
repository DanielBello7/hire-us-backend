import { DatabaseModule } from 'src/database/database.module';
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
