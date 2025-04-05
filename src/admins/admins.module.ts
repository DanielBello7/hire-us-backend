import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    exports: [AdminsService],
    controllers: [AdminsController],
    providers: [AdminsService],
    imports: [DatabaseModule, AccountsModule],
})
export class AdminsModule {}
