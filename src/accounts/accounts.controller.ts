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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, AllowRoles, ACCOUNT_ROLES_ENUM } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accounts: AccountsService) {}

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Get()
    getAccounts(@Query() query: Record<string, any>) {
        return this.accounts.get(query);
    }

    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accounts.findById(id);
    }

    @UseGuards(SessionGuard)
    @Put(':id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number,
        @Body() updates: UpdateAccountDto,
    ) {
        return this.accounts.modify(id, updates);
    }
}
