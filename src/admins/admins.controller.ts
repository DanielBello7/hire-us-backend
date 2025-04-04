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
import { AdminsService } from './admins.service';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
export class AdminsController {
    constructor(private readonly admins: AdminsService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.admins.get(query);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.admins.findById(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateAdminDto,
    ) {
        return this.admins.modify(id, body);
    }
}
