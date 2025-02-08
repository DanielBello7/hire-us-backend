import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.promotionsService.findAll(query);
    }

    @Get('employee/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.promotionsService.employeePromotion(id);
    }

    @Post()
    create(@Body() body: CreatePromotionDto) {
        return this.promotionsService.create(body);
    }
}
