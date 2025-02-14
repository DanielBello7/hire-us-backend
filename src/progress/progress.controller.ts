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
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.progressService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.progressService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Post()
    create(@Body() body: CreateProgressDto) {
        return this.progressService.create(body);
    }
}
