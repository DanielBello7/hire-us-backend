import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from '@app/database';
import { PersonModule } from 'src/person/person.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
    controllers: [AccountsController],
    exports: [AccountsService],
    providers: [AccountsService],
    imports: [DatabaseModule, PersonModule, AdminsModule, CompanyModule],
})
export class AccountsModule {}
