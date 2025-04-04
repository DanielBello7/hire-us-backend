import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SignUpService } from './signup.service';
import { CreateSignUpAdminDto } from './dto/create-signup-admin.dto';
import { CreateSignUpEmployeeDto } from './dto/create-signup-employee.dto';
import { CreateSignUpCompanyDto } from './dto/create-signup-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('signup')
export class SignUpController {
    constructor(private readonly signup: SignUpService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('admin')
    createAdministrator(
        @Body()
        data: CreateSignUpAdminDto,
    ) {
        return this.signup.signup_admin(data);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('employee')
    createEmployee(@Body() data: CreateSignUpEmployeeDto) {
        return this.signup.signup_employee(data);
    }

    @Post('company')
    createOrganization(
        @Body()
        data: CreateSignUpCompanyDto,
    ) {
        return this.signup.signup_company(data);
    }
}
