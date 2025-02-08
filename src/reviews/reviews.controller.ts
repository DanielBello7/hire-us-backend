import {
    Controller,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Body,
    ValidationPipe,
    Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.reviewsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateReviewDto) {
        return this.reviewsService.create(body);
    }
}
