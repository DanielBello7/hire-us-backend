import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        DatabaseModule,
        AccountsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [PersonController],
    exports: [PersonService],
    providers: [PersonService],
})
export class PersonModule {}
