import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [ReviewsService],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [ReviewsController],
    exports: [ReviewsService],
})
export class ReviewsModule {}
