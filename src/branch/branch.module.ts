import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [BranchController],
    exports: [BranchService],
    providers: [BranchService],
    imports: [DatabaseService],
})
export class BranchModule {}
