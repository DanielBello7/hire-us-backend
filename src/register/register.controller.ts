import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RoleGuard } from 'src/role/role.guard';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';

@Controller('register')
export class RegisterController {
    constructor(private readonly register: RegisterService) {}

    @Post('administrator')
    createAdministrator(
        @Body()
        data: CreateRegisterAdministratorDto,
    ) {
        return this.register.registerAdministrator(data);
    }

    @Post('employee')
    @UseGuards(RoleGuard)
    createEmployee(@Body() data: CreateRegisterEmployeeDto) {
        return this.register.registerEmployee(data);
    }

    @Post('organization')
    createOrganization(
        @Body()
        data: CreateRegisterOrganizationDto,
    ) {
        return this.register.registerOrganization(data);
    }
}
