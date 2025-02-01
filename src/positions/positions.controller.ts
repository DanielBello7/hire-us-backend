import {
    Controller,
    Get,
    Delete,
    Post,
    ParseIntPipe,
    Body,
    ValidationPipe,
    Param,
    Patch,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    findAll() {
        return this.positionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.positionsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreatePositionDto) {
        return this.positionsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdatePositionDto,
    ) {
        return this.positionsService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.positionsService.remove(id);
    }
}
