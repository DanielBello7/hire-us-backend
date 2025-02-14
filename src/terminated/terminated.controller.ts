import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('terminated')
export class TerminatedController {
    constructor(private readonly terminatedService: TerminatedService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll() {
        return this.terminatedService.findAll();
    }

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.terminatedService.findOne(+id);
    }
}
