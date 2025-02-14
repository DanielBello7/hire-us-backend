import {
    Controller,
    Param,
    Patch,
    Get,
    ParseIntPipe,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('person')
export class PersonController {
    constructor(private readonly person: PersonService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.person.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.person.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePersonDto,
    ) {
        return this.person.updatePerson(id, body);
    }
}
