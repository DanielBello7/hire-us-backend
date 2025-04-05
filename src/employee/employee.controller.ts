import {
    Controller,
    Param,
    ParseIntPipe,
    Body,
    Get,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { LayoffEmployeeDto } from './dto/layoff-emplyee.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employee: EmployeeService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.employee.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.employee.findById(id);
    }

    @UseGuards(SessionGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateEmployeeDto) {
        return this.employee.modify(+id, body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id/terminate/')
    terminate(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: LayoffEmployeeDto,
    ) {
        return this.employee.layoff(id, body.reason);
    }
}
