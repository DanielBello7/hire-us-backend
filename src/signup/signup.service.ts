import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { PersonService } from 'src/person/person.service';
import { CompanyService } from 'src/company/company.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateSignUpEmployeeDto } from './dto/create-signup-employee.dto';
import { CreateSignUpAdminDto } from './dto/create-signup-admin.dto';
import { CreateSignUpCompanyDto } from './dto/create-signup-company.dto';
import { AdminsService } from 'src/admins/admins.service';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAdminDto } from 'src/admins/dto/create-admins.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
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
    async signup_employee(
        body: CreateSignUpEmployeeDto,
        database?: PrismaDatabaseService,
    ) {
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            const account = await this.account.save(
                { ...body, isEmailVerified: false },
                db,
            );

            const person = await this.person.save(
                {
                    ...plainToInstance(CreatePersonDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    account: account.id,
                },
                db,
            );

            return this.employee.save(
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

    /** This creates an account and creates an admin account */
    async signup_admin(
        body: CreateSignUpAdminDto,
        database?: PrismaDatabaseService,
    ) {
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            const account = await this.account.save(
                { ...body, isEmailVerified: false },
                db,
            );

            return this.admin.save(
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

    /** This creates an account, and creates an company ccount*/
    async signup_company(
        body: CreateSignUpCompanyDto,
        database?: PrismaDatabaseService,
    ) {
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;

            const account = await this.account.save(
                {
                    ...plainToInstance(CreateAccountDto, body, {
                        excludeExtraneousValues: true,
                    }),
                    isEmailVerified: false,
                },
                db,
            );

            return this.company.save(
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
