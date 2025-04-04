import {
    Controller,
    Get,
    Patch,
    Body,
    Delete,
    Query,
    Post,
    ParseIntPipe,
    Param,
    UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { AuthGuard } from '@nestjs/passport';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('branches')
export class BranchController {
    constructor(private readonly branch: BranchService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.branch.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branch.findById(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateBranchDto) {
        return this.branch.createBranch(body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateBranchDto,
    ) {
        return this.branch.updateBranch(id, body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id/manager/')
    changeManager(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateBranchManagerDto,
    ) {
        return this.branch.updateManager(id, body.manager);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.branch.removeBranch(id);
    }
}
