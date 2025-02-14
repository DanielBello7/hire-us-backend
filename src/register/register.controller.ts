import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AllowRoles } from 'src/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from 'src/roles/enums/roles.enum';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('register')
export class RegisterController {
    constructor(private readonly register: RegisterService) {}

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('administrator')
    createAdministrator(
        @Body()
        data: CreateRegisterAdministratorDto,
    ) {
        return this.register.registerAdministrator(data);
    }

    @UseGuards(PassprtJWTGuard)
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
