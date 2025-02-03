import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export enum ExamStatusEnum {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
}

export class CreateExamStatusDto
    implements Omit<Prisma.ExamStatusCreateInput, 'employee'>
{
    @Matches(ExamStatusEnum.ONGOING)
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @IsNumber()
    employee: number;
}
