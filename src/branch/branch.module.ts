import { EmployeeModule } from 'src/employee/employee.module';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';

@Module({
    controllers: [BranchController],
    exports: [BranchService],
    imports: [EmployeeModule, DatabaseModule],
    providers: [BranchService],
})
export class BranchModule {}
