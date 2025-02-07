import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}

    @SkipThrottle({ default: false })
    @Get()
    getAccounts(@Query() query: ExpressQuery) {
        return this.accountService.getAccounts(query);
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
