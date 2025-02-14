import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { TerminatedModule } from 'src/terminated/terminated.module';

@Module({
    imports: [DatabaseModule, TerminatedModule],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {}
