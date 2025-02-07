import {
    Controller,
    Get,
    Body,
    ValidationPipe,
    Query,
    Post,
    Delete,
    ParseIntPipe,
    Param,
    Patch,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';

@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.branchService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateBranchDto) {
        return this.branchService.createBranch(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateBranchDto,
    ) {
        return this.branchService.updateBranch(id, body);
    }

    @Patch(':id/manager/')
    changeManager(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateBranchManagerDto,
    ) {
        return this.branchService.updateManager(id, body.manager);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.removeBranch(id);
    }
}
