import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('terminated')
export class TerminatedController {
    constructor(private readonly terminated: TerminatedService) {}

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.terminated.get(query);
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    find(@Param('id') id: string) {
        return this.terminated.findById(+id);
    }
}
