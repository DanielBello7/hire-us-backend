import { PartialType } from '@nestjs/mapped-types';
import { CreateExamStatusDto } from './create-exam-status.dto';

export class UpdateExamStatusDto extends PartialType(CreateExamStatusDto) {}
