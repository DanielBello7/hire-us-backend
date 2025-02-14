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
import { AllowRoles } from 'src/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from 'src/roles/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get()
    getAccounts(@Query() query: ExpressQuery) {
        return this.accountService.getAccounts(query);
    }

    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accountService.findAccount(id);
    }

    @UseGuards(PassprtJWTGuard)
    @Put(':id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number,
        @Body() updates: UpdateAccountDto,
    ) {
        return this.accountService.updateAccount(id, updates);
    }
}
