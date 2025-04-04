import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CompanyModule } from 'src/company/company.module';
import { PersonModule } from 'src/person/person.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [UploadsService],
    exports: [UploadsService],
    controllers: [UploadsController],
    imports: [
        DatabaseModule,
        CompanyModule,
        AccountsModule,
        PersonModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
})
export class UploadsModule {}
