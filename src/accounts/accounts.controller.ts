import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}

    @Get()
    getAccounts(@Query() query: ExpressQuery) {
        return this.accountService.getAccounts(query);
    }

    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accountService.findAccount(id);
    }

    @Put(':id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number,
        @Body() updates: UpdateAccountDto,
    ) {
        return this.accountService.updateAccount(id, updates);
    }
}
