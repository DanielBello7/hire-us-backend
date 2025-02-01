import {
    Controller,
    Param,
    ParseIntPipe,
    Body,
    Get,
    Patch,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get()
    findAll() {
        return this.employeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.employeeService.update(+id, updateEmployeeDto);
    }

    @Patch(':id/terminate')
    terminate(@Param('id', ParseIntPipe) id: number) {
        return this.employeeService.layoffEmployee(id);
    }
}
