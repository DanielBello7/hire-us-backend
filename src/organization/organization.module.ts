import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    imports: [DatabaseModule],
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: [OrganizationService, AccountsModule],
})
export class OrganizationModule {}
