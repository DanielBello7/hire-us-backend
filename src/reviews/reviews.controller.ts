import {
    Controller,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.reviewsService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ORGANIZATIONS, ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateReviewDto) {
        return this.reviewsService.create(body);
    }
}
