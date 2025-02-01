import {
    Controller,
    Param,
    ValidationPipe,
    Patch,
    Get,
    ParseIntPipe,
    Body,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
    constructor(private readonly person: PersonService) {}

    @Get()
    findAll() {
        return this.person.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.person.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
    ) {
        return this.person.update(id, updatePersonDto);
    }
}
