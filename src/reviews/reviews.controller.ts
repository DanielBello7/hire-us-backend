import {
    Controller,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Body,
    ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(createReviewDto);
    }
}
