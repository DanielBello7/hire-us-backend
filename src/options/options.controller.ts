import {
    Post,
    Body,
    Patch,
    Controller,
    Get,
    Delete,
    ValidationPipe,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionsService } from './options.service';

@Controller('options')
export class OptionsController {
    constructor(private readonly optionsService: OptionsService) {}

    @Get()
    findAll() {
        return this.optionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateOptionDto) {
        return this.optionsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateOptionDto,
    ) {
        return this.optionsService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.remove(id);
    }
}
