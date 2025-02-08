import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('administrators')
export class AdministratorController {
    constructor(private readonly administratorService: AdministratorService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.administratorService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.administratorService.findOne(id);
    }

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
