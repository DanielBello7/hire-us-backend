import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';

@Controller('administrators')
export class AdministratorController {
    constructor(private readonly administratorService: AdministratorService) {}

    @Get()
    findAll() {
        return this.administratorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.administratorService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdministratorDto: UpdateAdministratorDto,
    ) {
        return this.administratorService.updateAdmin(
            id,
            updateAdministratorDto,
        );
    }
}
