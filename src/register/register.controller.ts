import {
    Controller,
    Post,
    Ip,
    Body,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RoleGuard } from 'src/role/role.guard';
import { CreateRegisterAdministratorDto } from './dto/create-register-administrator.dto';
import { CreateRegisterEmployeeDto } from './dto/create-register-employee.dto';
import { CreateRegisterOrganizationDto } from './dto/create-register-organization.dto';
import { WinstonService } from 'src/winston/winston.service';

@SkipThrottle()
@Controller('register')
export class RegisterController {
    constructor(private readonly register: RegisterService) {}
    private readonly logger = new WinstonService(RegisterController.name);

    @Post('administrator')
    createAdministrator(
        @Body(new ValidationPipe())
        data: CreateRegisterAdministratorDto,
    ) {
        return this.register.registerAdministrator(data);
    }

    @Post('employee')
    @Throttle({ short: { ttl: 1000, limit: 1 } })
    @UseGuards(RoleGuard)
    createEmployee(
        @Body(new ValidationPipe()) data: CreateRegisterEmployeeDto,
    ) {
        return this.register.registerEmployee(data);
    }

    @Post('organization')
    @UseGuards(RoleGuard)
    createOrganization(
        @Ip() ip: string,
        @Body(new ValidationPipe()) data: CreateRegisterOrganizationDto,
    ) {
        this.logger.log(`request made from ${ip}`);
        return this.register.registerOrganization(data);
    }
}
