import {
    Controller,
    Post,
    Body,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RoleGuard } from 'src/role/role.guard';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { CreateRegisterDto } from './dto/create-register.dto';

@SkipThrottle()
@Controller('register')
export class RegisterController {
    constructor(private readonly register: RegisterService) {}

    @Post('administrator')
    createAdministrator(
        @Body(new ValidationPipe())
        data: CreateAccountDto,
    ) {
        return this.register.createAdministrator(data);
    }

    @Post('employee')
    @Throttle({ short: { ttl: 1000, limit: 1 } })
    @UseGuards(RoleGuard)
    createEmployee(@Body(new ValidationPipe()) data: CreateRegisterDto) {
        return this.register.createEmployee(data);
    }

    @Post('organiztion')
    @UseGuards(RoleGuard)
    createOrganization(@Body(new ValidationPipe()) data: CreateAccountDto) {
        return this.register.createOrganization(data);
    }
}
