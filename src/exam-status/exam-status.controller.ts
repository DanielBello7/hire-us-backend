import {
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Param,
    Body,
    ValidationPipe,
} from '@nestjs/common';
import { CreateExamStatusDto } from './dto/create-exam-status.dto';
import { ExamStatusService } from './exam-status.service';

@Controller('exam-status')
export class ExamStatusController {
    constructor(private readonly examStatusService: ExamStatusService) {}

    @Get()
    findAll() {
        return this.examStatusService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examStatusService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateExamStatusDto) {
        return this.examStatusService.create(body);
    }
}
