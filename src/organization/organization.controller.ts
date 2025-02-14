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
import { AllowRoles } from 'src/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from 'src/roles/enums/roles.enum';
import { RolesGuard } from 'src/roles/guards/roles.guard';

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
