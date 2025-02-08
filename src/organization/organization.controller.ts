import {
    Controller,
    Body,
    ValidationPipe,
    ParseIntPipe,
    Patch,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organization: OrganizationService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.organization.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.organization.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateOrganizationDto,
    ) {
        return this.organization.updateOrganization(+id, body);
    }
}
