import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.promotionsService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get('employee/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.promotionsService.employeePromotion(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreatePromotionDto) {
        return this.promotionsService.create(body);
    }
}
