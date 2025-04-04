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
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('person')
export class PersonController {
    constructor(private readonly person: PersonService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.person.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.person.findById(id);
    }

    @UseGuards(SessionGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePersonDto,
    ) {
        return this.person.modify(id, body);
    }
}
