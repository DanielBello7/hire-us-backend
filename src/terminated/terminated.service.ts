import { Injectable } from '@nestjs/common';
import { CreateTerminatedDto } from './dto/create-terminated.dto';
import { UpdateTerminatedDto } from './dto/update-terminated.dto';

@Injectable()
export class TerminatedService {
  create(createTerminatedDto: CreateTerminatedDto) {
    return 'This action adds a new terminated';
  }

  findAll() {
    return `This action returns all terminated`;
  }

  findOne(id: number) {
    return `This action returns a #${id} terminated`;
  }

  update(id: number, updateTerminatedDto: UpdateTerminatedDto) {
    return `This action updates a #${id} terminated`;
  }

  remove(id: number) {
    return `This action removes a #${id} terminated`;
  }
}
