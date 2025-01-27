import {
    Body,
    Controller,
    Get,
    Param,
    ParseBoolPipe,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RoleGuard } from 'src/role/role.guard';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}
    @Get()
    getAccounts(@Query('isVerified', ParseBoolPipe) isVerified: boolean) {
        return this.accountService.getAccounts(isVerified);
    }

    @Get(':id')
    getAccount(@Param('id') id: string) {
        return this.accountService.findAccount(id);
    }

    @Post()
    @UseGuards(RoleGuard)
    createAccount(@Body(new ValidationPipe()) data: CreateAccountDto) {
        return this.accountService.createAccount(data);
    }

    @Put(':id')
    updateAccount(
        @Param('id') id: string,
        @Body(ValidationPipe) updates: UpdateAccountDto,
    ) {
        return this.accountService.updateAccount(id, updates);
    }
}
