import {
    Controller,
    Delete,
    Get,
    Patch,
    Param,
    Body,
    Post,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';

@Controller('exams')
export class ExamsController {
    constructor(private readonly exams: ExamsService) {}

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete('exam/:id')
    deleteExamQuestions(@Param('id', ParseIntPipe) id: number) {
        return this.exams.deleteQtn(id);
    }

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.exams.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    one(@Param('id', ParseIntPipe) id: number) {
        return this.exams.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post(':id/questions/')
    add(
        @Body() body: CreateQuestionDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.exams.addQtns(id, [body]);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreateExamDto) {
        return this.exams.create(body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(SessionGuard, RolesGuard)
    @Post(':id/submit')
    submitExam(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: SubmitExamDto,
    ) {
        return this.exams.submit(id, body.employeeid);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExamDto) {
        return this.exams.modify(id, body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.exams.remove(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post(':id/eligible_positions')
    addEligiblePositions(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { positions: number[] },
    ) {
        return this.exams.updateEligiblePositions(id, body.positions, []);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post(':id/ineligible_employees')
    addIneligibleEmployees(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { employees: number[] },
    ) {
        return this.exams.updateIneligibleEmployees(id, body.employees, []);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete(':exam/eligible_positions/:id')
    removeEligiblePositions(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.exams.updateEligiblePositions(exam, [], [id]);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete(':exam/ineligible_employees/:id')
    removeIneligibleEmployees(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.exams.updateIneligibleEmployees(exam, [], [id]);
    }
}
