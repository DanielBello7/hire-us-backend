import { CompanyModule } from 'src/company/company.module';
import { PersonModule } from 'src/person/person.module';
import { UploadsController } from './uploads.controller';
import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    providers: [UploadsService],
    exports: [UploadsService],
    controllers: [UploadsController],
    imports: [DatabaseModule, CompanyModule, AccountsModule, PersonModule],
})
export class UploadsModule {}
