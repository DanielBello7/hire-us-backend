import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from 'src/database/database.module';
import { PersonModule } from 'src/person/person.module';

@Module({
    controllers: [AccountsController],
    imports: [DatabaseModule, PersonModule],
    providers: [AccountsService],
    exports: [AccountsService],
})
export class AccountsModule {}
