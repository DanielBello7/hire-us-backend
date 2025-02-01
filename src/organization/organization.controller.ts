import {
    Controller,
    Body,
    ValidationPipe,
    ParseIntPipe,
    Patch,
    Get,
    Param,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organization: OrganizationService) {}

    @Get()
    findAll() {
        return this.organization.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.organization.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) body: UpdateOrganizationDto,
    ) {
        return this.organization.update(+id, body);
    }
}
