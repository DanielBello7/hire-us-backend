import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { PersonService } from 'src/person/person.service';
import { CompanyService } from 'src/company/company.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateSignUpEmployeeDto } from './dto/create-signup-employee.dto';
import { CreateSignUpAdminDto } from './dto/create-signup-admin.dto';
import { CreateSignUpCompanyDto } from './dto/create-signup-company.dto';
import { AdminsService } from 'src/admins/admins.service';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { plainToInstance } from 'class-transformer';
import { CreateAdminDto } from 'src/admins/dto/create-admins.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';

@Injectable()
export class SignUpService {
    constructor(
        private readonly account: AccountsService,
        private readonly person: PersonService,
        private readonly db: DatabaseService,
        private readonly company: CompanyService,
        private readonly employee: EmployeeService,
        private readonly admin: AdminsService,
    ) {}

    /** This creates an account, creates  person account, and creates an employee account */
    async registerEmployee(
        body: CreateSignUpEmployeeDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isUsed(body.email),
            this.person.isUsed(body.email),
        ]);

        if (checks.includes(true)) {
            throw new BadRequestException('Employee already registered');
        }

        return this.db.$transaction(async (tx) => {
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
        body: CreateSignUpAdminDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isUsed(body.email),
            this.admin.isUsed(body.email),
        ]);

        if (checks.includes(true)) {
            throw new BadRequestException('Account already registered');
        }

        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            const account = await this.account.createAccount(
                { ...body, isEmailVerified: false },
                db,
            );

            return this.admin.createAdmin(
                {
                    ...plainToInstance(CreateAdminDto, body, {
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
        body: CreateSignUpCompanyDto,
        database?: PrismaDatabaseService,
    ) {
        const checks = await Promise.all([
            this.account.isUsed(body.email),
            this.company.isUsed(body.email, body.taxid),
        ]);

        if (checks.includes(true))
            throw new BadRequestException('Account already registered');

        return this.db.$transaction(async (tx) => {
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

            return this.company.createCompany(
                {
                    ...plainToInstance(CreateCompanyDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    account: account.id,
                },
                db,
            );
        });
    }
}
