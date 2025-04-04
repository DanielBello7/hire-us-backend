import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        DatabaseModule,
        AccountsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [CompanyService],
    controllers: [CompanyController],
    exports: [CompanyService],
})
export class CompanyModule {}
