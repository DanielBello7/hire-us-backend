import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from '@app/database';
import { TerminatedModule } from 'src/terminated/terminated.module';

@Module({
    imports: [DatabaseModule, TerminatedModule],
    providers: [EmployeeService],
    exports: [EmployeeService],
    controllers: [EmployeeController],
})
export class EmployeeModule {}
