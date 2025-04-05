import {
    Post,
    Body,
    Patch,
    Controller,
    Get,
    Delete,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionsService } from './options.service';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('options')
export class OptionsController {
    constructor(private readonly options: OptionsService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.options.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.options.findById(id);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Post()
    create(@Body() body: CreateOptionDto) {
        return this.options.create(body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateOptionDto,
    ) {
        return this.options.modify(id, body);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(SessionGuard, RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.options.remove(id);
    }
}
