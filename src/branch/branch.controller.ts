import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    ValidationPipe,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Post()
    create(@Body(new ValidationPipe()) body: CreateBranchDto) {
        return this.branchService.create(body);
    }

    @Get()
    findAll(@Query('organization', ParseIntPipe) organization: number) {
        return this.branchService.findAll(organization);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.findOne(id);
    }

    /**
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateBranchDto,
    ) {
        return this.branchService.update(id, body);
    }
    */

    /** PATCH /branch/:id/manager/ */

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.remove(id);
    }

    @Delete(':organization')
    deleteMany(@Param('id', ParseIntPipe) id: number) {
        return this.branchService.remove(id);
    }
}
