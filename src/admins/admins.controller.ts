import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('admins')
export class AdminsController {
    constructor(private readonly admins: AdminsService) {}

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateAdminDto,
    ) {
        return this.admins.modify(id, body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(SessionGuard, RolesGuard)
    @Get()
    getAdmins(@Query() query: Record<string, any>) {
        return this.admins.get(query);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN)
    @UseGuards(SessionGuard, RolesGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.admins.findById(id);
    }
}
