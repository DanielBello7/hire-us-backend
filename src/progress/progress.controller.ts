import {
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Param,
    Body,
    Query,
} from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressService } from './progress.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.progressService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.progressService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateProgressDto) {
        return this.progressService.create(body);
    }
}
