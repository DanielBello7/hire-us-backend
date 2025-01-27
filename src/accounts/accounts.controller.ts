import {
    Body,
    Controller,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}

    @SkipThrottle({ default: false })
    @Get()
    getAccounts(@Query('isVerified', ParseBoolPipe) isVerified?: boolean) {
        return this.accountService.getAccounts(isVerified);
    }

    @Throttle({ short: { ttl: 1000, limit: 1 } })
    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accountService.findAccount(id);
    }

    @Put(':id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updates: UpdateAccountDto,
    ) {
        return this.accountService.updateAccount(id, updates);
    }
}
