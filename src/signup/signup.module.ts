import { Module, OnModuleInit } from '@nestjs/common';
import { SignUpService } from './signup.service';
import { SignUpController } from './signup.controller';
import { DatabaseModule } from '@app/database';
import { PersonModule } from 'src/person/person.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminsModule } from 'src/admins/admins.module';
import { AdminsService } from 'src/admins/admins.service';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [SignUpController],
    providers: [SignUpService],
    imports: [
        EmployeeModule,
        PersonModule,
        PassportModule,
        CompanyModule,
        AccountsModule,
        AdminsModule,
        DatabaseModule,
    ],
})
export class SignUpModule implements OnModuleInit {
    constructor(
        private readonly admins: AdminsService,
        private readonly signup: SignUpService,
    ) {}

    async onModuleInit() {
        /**
         * check if there's any existing admin upon initial loading of the application.
         * if there isn't any, create one
         */
        const response = await this.admins.get();
        if (response.length < 1) {
            await this.signup.signup_admin({
                email: 'admin@example.com',
                name: 'admin admin',
                password: 'Password1$',
                role: ACCOUNT_ROLES_ENUM.ADMIN,
            });
            return;
        } else {
            return;
        }
    }
}
