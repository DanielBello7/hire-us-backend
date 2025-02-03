import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @Get()
    findAll() {
        return this.promotionsService.findAll();
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
