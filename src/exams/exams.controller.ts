import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Body,
    Post,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AuthGuard } from '@nestjs/passport';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('exams')
export class ExamsController {
    constructor(private readonly exams: ExamsService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete('exam/:id')
    deleteExamQuestions(@Param('id', ParseIntPipe) id: number) {
        return this.exams.deleteQtn(id);
    }

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.exams.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.exams.findById(id);
    }

    @UseGuards(SessionGuard)
    @UseGuards(AuthGuard(), RolesGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @Post()
    create(@Body() body: CreateExamDto) {
        return this.exams.create(body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post(':id/submit')
    submitExam(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: SubmitExamDto,
    ) {
        return this.exams.submit(id, body.employeeid);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExamDto) {
        return this.exams.modify(id, body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.exams.remove(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post(':id/eligible_positions')
    addEligiblePositions(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { positions: number[] },
    ) {
        return this.exams.updateEligiblePositions(id, body.positions, []);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post(':id/ineligible_employees')
    addIneligibleEmployees(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { employees: number[] },
    ) {
        return this.exams.updateIneligibleEmployees(id, body.employees, []);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':exam/eligible_positions/:id')
    removeEligiblePositions(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.exams.updateEligiblePositions(exam, [], [id]);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':exam/ineligible_employees/:id')
    removeIneligibleEmployees(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.exams.updateIneligibleEmployees(exam, [], [id]);
    }
}
