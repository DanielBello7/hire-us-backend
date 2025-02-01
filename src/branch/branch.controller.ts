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

@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Get()
    findAll(@Query('organization', ParseIntPipe) organization: number) {
        return this.branchService.findAll(organization);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.findOne(id);
    }

    @Post()
    create(@Body(new ValidationPipe()) body: CreateBranchDto) {
        return this.branchService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateBranchDto,
    ) {
        return this.branchService.update(id, body);
    }

    @Patch(':id/manager')
    changeManager(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: { manager: number },
    ) {
        return this.branchService.updateManager(id, body.manager);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.remove(id);
    }
}
