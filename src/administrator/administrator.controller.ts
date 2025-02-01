import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
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
    findOne(@Param('id') id: string) {
        return this.administratorService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAdministratorDto: UpdateAdministratorDto,
    ) {
        return this.administratorService.update(+id, updateAdministratorDto);
    }
}
