import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    controllers: [AdministratorController],
    exports: [AdministratorService],
    imports: [DatabaseModule],
    providers: [AdministratorService, AccountsModule],
})
export class AdministratorModule {}
