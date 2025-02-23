import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { PersonModule } from 'src/person/person.module';

@Module({
    providers: [UploadsService],
    exports: [UploadsService],
    controllers: [UploadsController],
    imports: [DatabaseModule, AccountsModule, OrganizationModule, PersonModule],
})
export class UploadsModule {}
