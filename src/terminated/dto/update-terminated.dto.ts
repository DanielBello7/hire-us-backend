import { PartialType } from '@nestjs/mapped-types';
import { CreateTerminatedDto } from './create-terminated.dto';

export class UpdateTerminatedDto extends PartialType(CreateTerminatedDto) {}
