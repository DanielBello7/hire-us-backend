import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PaymentsController],
    exports: [PaymentsService],
    providers: [PaymentsService],
})
export class PaymentsModule {}
