import { EmployeeModule } from 'src/employee/employee.module';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [BranchController],
    exports: [BranchService],
    imports: [
        EmployeeModule,
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [BranchService],
})
export class BranchModule {}
