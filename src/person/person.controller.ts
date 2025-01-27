import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    ValidationPipe,
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
        @Param('id') id: string,
        @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
    ) {
        return this.person.update(+id, updatePersonDto);
    }
}
