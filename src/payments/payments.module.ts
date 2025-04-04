import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        DatabaseModule,
        EmployeeModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    exports: [PaymentsService],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}
