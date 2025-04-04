import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Matches,
} from 'class-validator';
export enum PROGRESS_ENUM {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
}
export class CreateProgressDto
    implements
        Omit<Prisma.ProgressCreateInput, 'employee' | 'exam' | 'lastQuestion'>
{
    @Expose()
    @Matches(PROGRESS_ENUM.ONGOING)
    @IsNotEmpty()
    status: PROGRESS_ENUM;
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
    completed?: boolean | undefined;
    @Expose()
    @IsNumber()
    @IsOptional()
    lastQuestion?: number | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
