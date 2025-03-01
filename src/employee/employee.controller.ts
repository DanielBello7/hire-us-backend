import {
    Controller,
    Param,
    ParseIntPipe,
    Body,
    Get,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { LayoffEmployeeDto } from './dto/layoff-emplyee.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.employeeService.findEmployees(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.findOne(id);
    }

    @UseGuards(SessionGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(+id, body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id/terminate/')
    terminate(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: LayoffEmployeeDto,
    ) {
        return this.employeeService.layoffEmployee(id, body.reason);
    }
}
