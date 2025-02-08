import {
    Controller,
    Get,
    Delete,
    Post,
    ParseIntPipe,
    Body,
    ValidationPipe,
    Param,
    Patch,
    Query,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.positionsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.positionsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreatePositionDto) {
        return this.positionsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdatePositionDto,
    ) {
        return this.positionsService.updatePosition(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.positionsService.remove(id);
    }
}
