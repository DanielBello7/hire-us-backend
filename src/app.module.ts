import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { PersonModule } from './person/person.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RegisterModule } from './register/register.module';
import { AdministratorModule } from './administrator/administrator.module';
import { EmployeeModule } from './employee/employee.module';
import { OrganizationModule } from './organization/organization.module';
import { WinstonLoggerModule } from './winston-logger/winston-logger.module';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 3,
                name: 'short',
            },
            {
                ttl: 60000,
                limit: 100,
                name: 'long',
            },
        ]),
        AccountsModule,
        AdministratorModule,
        OrganizationModule,
        DatabaseModule,
        RegisterModule,
        PersonModule,
        EmployeeModule,
        WinstonLoggerModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
