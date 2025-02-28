import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('register')
export class RegisterController {
    constructor(private readonly register: RegisterService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('administrator')
    createAdministrator(
        @Body()
        data: CreateRegisterAdministratorDto,
    ) {
        return this.register.registerAdministrator(data);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('employee')
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
