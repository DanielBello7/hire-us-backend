import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TerminatedService } from './terminated.service';
import { CreateTerminatedDto } from './dto/create-terminated.dto';
import { UpdateTerminatedDto } from './dto/update-terminated.dto';

@Controller('terminated')
export class TerminatedController {
  constructor(private readonly terminatedService: TerminatedService) {}

  @Post()
  create(@Body() createTerminatedDto: CreateTerminatedDto) {
    return this.terminatedService.create(createTerminatedDto);
  }

  @Get()
  findAll() {
    return this.terminatedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.terminatedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTerminatedDto: UpdateTerminatedDto) {
    return this.terminatedService.update(+id, updateTerminatedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.terminatedService.remove(+id);
  }
}
