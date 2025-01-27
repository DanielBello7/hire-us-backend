import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PersonModule } from 'src/person/person.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    controllers: [RegisterController],
    providers: [RegisterService],
    imports: [DatabaseModule, PersonModule, AccountsModule],
})
export class RegisterModule {}
