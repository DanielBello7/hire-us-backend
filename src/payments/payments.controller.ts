import {
    Controller,
    Param,
    Get,
    Body,
    ParseIntPipe,
    Post,
    UseGuards,
    Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly payments: PaymentsService) {}

    @AllowRoles(ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreatePaymentDto) {
        return this.payments.payEmployeeSalary(body.employee);
    }

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.payments.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.payments.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post('bulk')
    makeSalaryPayments(@Body() body: { id: number }) {
        return this.payments.paySalaries(body.id);
    }
}
