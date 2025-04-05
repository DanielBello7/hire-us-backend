import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { RolesGuard, AllowRoles, ACCOUNT_ROLES_ENUM } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ResetAccountPasswordDto } from './dto/reset-account-password.dto';
import { ChangeAccountPasswordDto } from './dto/change-account-password.dto';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accounts: AccountsService) {}

    @UseGuards(SessionGuard, RolesGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @Get()
    getAccounts(@Query() query: Record<string, any>) {
        return this.accounts.get(query);
    }

    @Get(':id')
    getAccount(@Param('id', ParseIntPipe) id: number) {
        return this.accounts.findById(id);
    }

    @UseGuards(SessionGuard)
    @Patch(':id/password/recover/')
    recover(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ResetAccountPasswordDto,
    ) {
        return this.accounts.resetPassword(id, body.newPassword);
    }

    @UseGuards(SessionGuard)
    @Patch(':id/password/change/')
    change(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangeAccountPasswordDto,
    ) {
        return this.accounts.changePassword(
            id,
            body.oldPassword,
            body.newPassword,
        );
    }
}
