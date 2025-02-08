import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { PersonService } from 'src/person/person.service';
import { OrganizationService } from 'src/organization/organization.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';
import { AdministratorService } from 'src/administrator/administrator.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RegisterService {
    constructor(
        private readonly database: DatabaseService,
        private readonly account: AccountsService,
        private readonly person: PersonService,
        private readonly organization: OrganizationService,
        private readonly employee: EmployeeService,
        private readonly admin: AdministratorService,
    ) {}

    async registerEmployee(body: CreateRegisterEmployeeDto) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.person.isEmailRegistered(body.email),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('email already registered');

        const account = await this.account.createAccount({
            ...body,
            isEmailVerified: false,
        });
        const person = await this.person.createPerson({
            ...body,
            account: account.id,
        });
        return this.employee.createEmployee({ ...body, person: person.id });
    }

    async registerAdministrator(body: CreateRegisterAdministratorDto) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.admin.isEmailRegistered(body.email),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('email already registered');

        const account = await this.account.createAccount({
            ...body,
            isEmailVerified: false,
        });
        return this.admin.createAdmin({ ...body, account: account.id });
    }

    async registerOrganization(body: CreateRegisterOrganizationDto) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.organization.isOrganizationRegistered(body.email, body.taxId),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('email already registered');

        const account = await this.account.createAccount({
            ...body,
            isEmailVerified: false,
        });
        return this.organization.createOrganization({
            ...body,
            account: account.id,
        });
    }
}
