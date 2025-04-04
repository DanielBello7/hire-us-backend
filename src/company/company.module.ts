import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService, AccountsModule],
})
export class CompanyModule {}
