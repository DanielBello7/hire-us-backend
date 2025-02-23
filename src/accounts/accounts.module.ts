import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from '@app/database';
import { PersonModule } from 'src/person/person.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
    controllers: [AccountsController],
    exports: [AccountsService],
    providers: [AccountsService],
    imports: [
        DatabaseModule,
        PersonModule,
        AdministratorModule,
        OrganizationModule,
    ],
})
export class AccountsModule {}
