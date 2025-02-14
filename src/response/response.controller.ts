import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('responses')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.responseService.findAll(query);
    }
}
