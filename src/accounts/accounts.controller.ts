import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, AllowRoles, ACCOUNT_ROLES_ENUM } from '@app/roles';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accounts: AccountsService) {}

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get()
    getAccounts(@Query() query: ExpressQuery) {
        return this.accounts.getAccounts(query);
    }

    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accounts.findAccount(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Put(':id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number,
        @Body() updates: UpdateAccountDto,
    ) {
        return this.accounts.updateAccount(id, updates);
    }
}
