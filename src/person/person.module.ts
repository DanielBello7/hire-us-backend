import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    imports: [DatabaseModule, AccountsModule],
    controllers: [PersonController],
    exports: [PersonService],
    providers: [PersonService],
})
export class PersonModule {}
