import {
    Controller,
    Param,
    ValidationPipe,
    Patch,
    Get,
    ParseIntPipe,
    Body,
    Query,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
    constructor(private readonly person: PersonService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.person.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.person.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdatePersonDto,
    ) {
        return this.person.updatePerson(id, body);
    }
}
