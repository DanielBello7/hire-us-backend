import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('terminated')
export class TerminatedController {
    constructor(private readonly terminated: TerminatedService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll() {
        return this.terminated.get();
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.terminated.findById(+id);
    }
}
