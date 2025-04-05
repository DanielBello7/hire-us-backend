import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SignUpService } from './signup.service';
import { CreateSignUpAdminDto } from './dto/create-signup-admin.dto';
import { CreateSignUpEmployeeDto } from './dto/create-signup-employee.dto';
import { CreateSignUpCompanyDto } from './dto/create-signup-company.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('signup')
export class SignUpController {
    constructor(private readonly signup: SignUpService) {}

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(SessionGuard, RolesGuard)
    @Post('admins')
    signupAdmin(
        @Body()
        data: CreateSignUpAdminDto,
    ) {
        return this.signup.signup_admin(data);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post('employees')
    signupEmployee(@Body() data: CreateSignUpEmployeeDto) {
        return this.signup.signup_employee(data);
    }

    @Post('company')
    signupCompany(
        @Body()
        data: CreateSignUpCompanyDto,
    ) {
        return this.signup.signup_company(data);
    }
}
