import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Body,
    Post,
    ParseIntPipe,
    NotImplementedException,
    Query,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('exams')
export class ExamsController {
    constructor(private readonly examsService: ExamsService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.examsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateExamDto) {
        return this.examsService.create(body);
    }

    @Post(':id/submit')
    submitExam(@Body() body: CreateExamDto) {
        /** not yet done */
        throw new NotImplementedException('NOT YET IMPLEMENTED', body);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExamDto) {
        return this.examsService.updateExam(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.remove(id);
    }

    @Post(':id/eligible_positions')
    addEligiblePositions(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { positions: number[] },
    ) {
        return this.examsService.updateEligiblePositions(
            id,
            body.positions,
            [],
        );
    }

    @Post(':id/ineligible_employees')
    addIneligibleEmployees(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { employees: number[] },
    ) {
        return this.examsService.updateIneligibleEmployees(
            id,
            body.employees,
            [],
        );
    }

    @Delete(':exam/eligible_positions/:id')
    removeEligiblePositions(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.examsService.updateEligiblePositions(exam, [], [id]);
    }

    @Delete(':exam/ineligible_employees/:id')
    removeIneligibleEmployees(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.examsService.updateIneligibleEmployees(exam, [], [id]);
    }
}
