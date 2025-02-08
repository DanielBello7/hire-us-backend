import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export enum ProgressEnum {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
}

export class CreateProgressDto
    implements Omit<Prisma.ProgressCreateInput, 'employee'>
{
    @Matches(ProgressEnum.ONGOING)
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @IsNumber()
    employee: number;
}
