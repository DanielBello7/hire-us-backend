import {
    Controller,
    Get,
    Body,
    Param,
    ParseIntPipe,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get()
    findAll() {
        return this.paymentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentsService.findOne(+id);
    }

    @Post()
    create(@Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    @Post('bulk')
    makeSalaryPayments(
        @Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto,
    ) {
        return this.paymentsService.create(createPaymentDto);
    }
}
