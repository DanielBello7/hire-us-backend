import { Controller, Get, Query } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('responses')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.responseService.findAll(query);
    }
}
