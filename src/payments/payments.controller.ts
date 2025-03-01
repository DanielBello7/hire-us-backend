import {
    Controller,
    Param,
    Get,
    Body,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly payments: PaymentsService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll() {
        return this.payments.findAll();
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.payments.findOne(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ORGANIZATIONS)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreatePaymentDto) {
        return this.payments.payEmployeeSalary(body.employee);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ORGANIZATIONS)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('bulk')
    makeSalaryPayments(@Body() body: { id: number }) {
        return this.payments.paySalaries(body.id);
    }
}
