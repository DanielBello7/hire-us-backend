import {
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressService } from './progress.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.progressService.findAll(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.progressService.findOne(id);
    }

    @UseGuards(SessionGuard)
    @Post()
    create(@Body() body: CreateProgressDto) {
        return this.progressService.create(body);
    }
}
