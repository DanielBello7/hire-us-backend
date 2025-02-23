import {
    Controller,
    Body,
    ParseIntPipe,
    Patch,
    Get,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organization: OrganizationService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.organization.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.organization.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateOrganizationDto,
    ) {
        return this.organization.updateOrganization(+id, body);
    }
}
