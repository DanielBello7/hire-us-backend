import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PersonModule } from 'src/person/person.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
    controllers: [RegisterController],
    providers: [RegisterService],
    imports: [
        PersonModule,
        OrganizationModule,
        EmployeeModule,
        DatabaseModule,
        AccountsModule,
        AdministratorModule,
    ],
})
export class RegisterModule {}
