import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    imports: [DatabaseModule, AccountsModule],
    providers: [CompanyService],
    controllers: [CompanyController],
    exports: [CompanyService],
})
export class CompanyModule {}
