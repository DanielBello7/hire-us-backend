import {
    Controller,
    Param,
    ParseIntPipe,
    Body,
    Get,
    Patch,
    Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.employeeService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(+id, body);
    }

    @Patch(':id/terminate/')
    terminate(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.layoffEmployee(id);
    }
}
