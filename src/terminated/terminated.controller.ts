import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('terminated')
export class TerminatedController {
    constructor(private readonly terminatedService: TerminatedService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll() {
        return this.terminatedService.findAll();
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.terminatedService.findOne(+id);
    }
}
