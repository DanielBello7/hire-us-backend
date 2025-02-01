import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { DatabaseService } from 'src/database/database.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
    controllers: [BranchController],
    exports: [BranchService],
    providers: [BranchService],
    imports: [DatabaseService, EmployeeService],
})
export class BranchModule {}
