import {
    Controller,
    Get,
    Body,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AllowRoles } from '@app/common/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { RolesGuard } from '@app/common/roles/guards/roles.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll() {
        return this.paymentsService.findAll();
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentsService.findOne(+id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ORGANIZATIONS)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ORGANIZATIONS)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('bulk')
    makeSalaryPayments(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }
}
