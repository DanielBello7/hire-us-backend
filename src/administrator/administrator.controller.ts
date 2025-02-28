import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { AuthGuard } from '@nestjs/passport';

@Controller('administrators')
export class AdministratorController {
    constructor(private readonly administratorService: AdministratorService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.administratorService.findAll(query);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.administratorService.findOne(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdministratorDto: UpdateAdministratorDto,
    ) {
        return this.administratorService.updateAdmin(
            id,
            updateAdministratorDto,
        );
    }
}
