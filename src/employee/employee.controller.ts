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
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AllowRoles } from '@app/common/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { RolesGuard } from '@app/common/roles/guards/roles.guard';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.employeeService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(+id, body);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id/terminate/')
    terminate(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.layoffEmployee(id);
    }
}
