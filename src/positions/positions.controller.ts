import {
    Controller,
    Get,
    Delete,
    Post,
    ParseIntPipe,
    Body,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positions: PositionsService) {}

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.positions.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.positions.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreatePositionDto) {
        return this.positions.save(body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePositionDto,
    ) {
        return this.positions.modify(id, body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.positions.remove(id);
    }
}
