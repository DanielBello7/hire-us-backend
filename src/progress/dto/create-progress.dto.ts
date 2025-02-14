import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Matches,
} from 'class-validator';

export enum ProgressEnum {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
}

export class CreateProgressDto
    implements
        Omit<Prisma.ProgressCreateInput, 'employee' | 'exam' | 'lastQuestion'>
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

    @Expose()
    @IsNumber()
    @IsOptional()
    score?: number | null | undefined;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean | undefined;

    @Expose()
    @IsNumber()
    @IsOptional()
    lastQuestion?: number | undefined;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
