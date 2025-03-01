import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from '@app/database';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
    controllers: [PromotionsController],
    imports: [DatabaseModule, EmployeeModule],
    exports: [PromotionsService],
    providers: [PromotionsService],
})
export class PromotionsModule {}
