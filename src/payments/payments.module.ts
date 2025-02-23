import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PaymentsController],
    exports: [PaymentsService],
    providers: [PaymentsService],
})
export class PaymentsModule {}
