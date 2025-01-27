import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { PersonModule } from './person/person.module';

@Module({
    imports: [AccountsModule, PersonModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
