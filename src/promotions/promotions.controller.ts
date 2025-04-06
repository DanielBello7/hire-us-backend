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
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotions: PromotionsService) {}

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.promotions.get(query);
    }

    @UseGuards(SessionGuard)
    @Get('employee/:id')
    one(@Param('id', ParseIntPipe) id: number) {
        return this.promotions.promote(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreatePromotionDto) {
        return this.promotions.create(body);
    }
}
