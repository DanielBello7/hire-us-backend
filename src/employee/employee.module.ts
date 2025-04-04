import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from '@app/database';
import { TerminatedModule } from 'src/terminated/terminated.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        DatabaseModule,
        TerminatedModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [EmployeeService],
    exports: [EmployeeService],
    controllers: [EmployeeController],
})
export class EmployeeModule {}
