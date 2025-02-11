import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export enum ProgressEnum {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
}

export class CreateProgressDto
    implements Omit<Prisma.ProgressCreateInput, 'employee' | 'exam'>
{
    @Expose()
    @Matches(ProgressEnum.ONGOING)
    @IsNotEmpty()
    status: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    employee: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    exam: number;
}
