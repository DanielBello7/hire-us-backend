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
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progress: ProgressService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.progress.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.progress.findById(id);
    }

    @UseGuards(SessionGuard)
    @Post()
    create(@Body() body: CreateProgressDto) {
        return this.progress.create(body);
    }
}
