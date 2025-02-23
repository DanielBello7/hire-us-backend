import {
    Controller,
    Get,
    Body,
    Query,
    Post,
    Delete,
    ParseIntPipe,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';

@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.branchService.findAll(query);
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.findOne(id);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(
        ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
        ACCOUNT_ROLES_ENUM.ORGANIZATIONS,
    )
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateBranchDto) {
        return this.branchService.createBranch(body);
    }

    @UseGuards(PassprtJWTGuard)
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

    @UseGuards(PassprtJWTGuard)
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

    @UseGuards(PassprtJWTGuard)
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
