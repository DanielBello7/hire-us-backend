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
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviews: ReviewsService) {}

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.reviews.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.reviews.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.COMPANY, ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreateReviewDto) {
        return this.reviews.create(body);
    }
}
