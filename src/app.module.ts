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
import { BranchModule } from './branch/branch.module';
import { PositionsModule } from './positions/positions.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { ExamStatusModule } from './exam-status/exam-status.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';

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
        BranchModule,
        PositionsModule,
        ExamsModule,
        QuestionsModule,
        OptionsModule,
        ExamStatusModule,
        PromotionsModule,
        ConversationsModule,
        MessagesModule,
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
