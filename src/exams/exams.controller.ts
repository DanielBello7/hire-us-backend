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
    UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AllowRoles } from '@app/common/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { RolesGuard } from '@app/common/roles/guards/roles.guard';

@Controller('exams')
export class ExamsController {
    constructor(private readonly examsService: ExamsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.examsService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateExamDto) {
        return this.examsService.create(body);
    }

    @UseGuards(PassprtJWTGuard)
    @Post(':id/submit')
    submitExam(@Body() body: CreateExamDto) {
        /** not yet done */
        throw new NotImplementedException('NOT YET IMPLEMENTED', body);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExamDto) {
        return this.examsService.updateExam(id, body);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.remove(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
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

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
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

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':exam/eligible_positions/:id')
    removeEligiblePositions(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.examsService.updateEligiblePositions(exam, [], [id]);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':exam/ineligible_employees/:id')
    removeIneligibleEmployees(
        @Param('exam', ParseIntPipe) exam: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.examsService.updateIneligibleEmployees(exam, [], [id]);
    }
}
