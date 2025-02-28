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
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { AuthGuard } from '@nestjs/passport';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.branchService.findAll(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.findOne(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateBranchDto) {
        return this.branchService.createBranch(body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateBranchDto,
    ) {
        return this.branchService.updateBranch(id, body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id/manager/')
    changeManager(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateBranchManagerDto,
    ) {
        return this.branchService.updateManager(id, body.manager);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.removeBranch(id);
    }
}
