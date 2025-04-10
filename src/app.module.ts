import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { PersonModule } from './person/person.module';
import { DatabaseModule } from '@app/database';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SignUpModule } from './signup/signup.module';
import { AdminsModule } from './admins/admins.module';
import { EmployeeModule } from './employee/employee.module';
import { CompanyModule } from './company/company.module';
import { WinstonModule } from '@app/winston';
import { BranchModule } from './branch/branch.module';
import { PositionsModule } from './positions/positions.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { ProgressModule } from './progress/progress.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentsModule } from './payments/payments.module';
import { ResponseModule } from './response/response.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { TerminatedModule } from './terminated/terminated.module';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            { ttl: 1000, limit: 1, name: 'typeA' },
            { ttl: 6000, limit: 3, name: 'typeB' },
        ]),
        CompanyModule,
        WinstonModule,
        BranchModule,
        PositionsModule,
        ExamsModule,
        AccountsModule,
        SignUpModule,
        QuestionsModule,
        MessagesModule,
        PersonModule,
        AdminsModule,
        ProgressModule,
        PromotionsModule,
        DatabaseModule,
        EmployeeModule,
        ConversationsModule,
        OptionsModule,
        ReviewsModule,
        PaymentsModule,
        ResponseModule,
        AuthModule,
        UploadsModule,
        TerminatedModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
