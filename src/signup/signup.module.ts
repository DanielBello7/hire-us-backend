import { Module } from '@nestjs/common';
import { SignUpService } from './signup.service';
import { SignUpController } from './signup.controller';
import { DatabaseModule } from '@app/database';
import { PersonModule } from 'src/person/person.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
    controllers: [SignUpController],
    providers: [SignUpService],
    imports: [
        PersonModule,
        CompanyModule,
        EmployeeModule,
        DatabaseModule,
        AccountsModule,
        AdminsModule,
    ],
})
export class SignUpModule {}
