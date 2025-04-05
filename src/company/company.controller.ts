import {
    Controller,
    Body,
    ParseIntPipe,
    Patch,
    Get,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('company')
export class CompanyController {
    constructor(private readonly company: CompanyService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.company.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.company.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCompanyDto,
    ) {
        return this.company.modify(+id, body);
    }
}
