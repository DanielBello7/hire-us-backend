import {
    Post,
    Body,
    Patch,
    Controller,
    Get,
    Delete,
    ValidationPipe,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionsService } from './options.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('options')
export class OptionsController {
    constructor(private readonly optionsService: OptionsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.optionsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateOptionDto) {
        return this.optionsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateOptionDto,
    ) {
        return this.optionsService.updateOption(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.remove(id);
    }
}
