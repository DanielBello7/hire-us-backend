import {
    Controller,
    Get,
    Delete,
    Post,
    ValidationPipe,
    Patch,
    Body,
    ParseIntPipe,
    Param,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateQuestionDto) {
        return this.questionsService.create(body);
    }

    @Post(':id/submit')
    submit(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: CreateQuestionDto,
    ) {
        return this.questionsService.submitQuestion(id, body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateQuestionDto,
    ) {
        return this.questionsService.updateQuestion(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.remove(id);
    }

    @Delete('exam/:id')
    deleteExamQuestions(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.deleteQuestions(id);
    }
}
