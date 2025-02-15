import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { PersonService } from 'src/person/person.service';
import { OrganizationService } from 'src/organization/organization.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';
import { AdministratorService } from 'src/administrator/administrator.service';
import { DatabaseService } from '@app/common/database/database.service';
import { plainToInstance } from 'class-transformer';
import { CreateAdministratorDto } from 'src/administrator/dto/create-administrator.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { PrismaDatabaseService } from '@app/common';

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

    /** This creates an account, creates  person account, and creates an employee account */
    async registerEmployee(
        body: CreateRegisterEmployeeDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.person.isEmailRegistered(body.email),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('Employee already registered');

        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            const account = await this.account.createAccount(
                {
                    ...body,
                    isEmailVerified: false,
                },
                db,
            );

            const person = await this.person.createPerson(
                {
                    ...plainToInstance(CreatePersonDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    account: account.id,
                },
                db,
            );

            return this.employee.createEmployee(
                {
                    ...plainToInstance(CreateEmployeeDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    person: person.id,
                },
                db,
            );
        });
    }

    /** This creates an account and creates an administrator account */
    async registerAdministrator(
        body: CreateRegisterAdministratorDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.admin.isEmailRegistered(body.email),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('Account already registered');

        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            const account = await this.account.createAccount(
                { ...body, isEmailVerified: false },
                db,
            );

            return this.admin.createAdmin(
                {
                    ...plainToInstance(CreateAdministratorDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    account: account.id,
                },
                db,
            );
        });
    }

    /** This creates an account, and creates an organization ccount*/
    async registerOrganization(
        body: CreateRegisterOrganizationDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isEmailRegistered(body.email),
            this.organization.isOrganizationRegistered(body.email, body.taxId),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('Account already registered');

        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;

            const account = await this.account.createAccount(
                {
                    ...plainToInstance(CreateAccountDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    isEmailVerified: false,
                },
                db,
            );

            return this.organization.createOrganization(
                {
                    ...plainToInstance(CreateOrganizationDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    account: account.id,
                },
                db,
            );
        });
    }
}
