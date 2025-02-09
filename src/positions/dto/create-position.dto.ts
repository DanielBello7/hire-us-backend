import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto
    implements
        Omit<
            Prisma.PositionCreateInput,
            'Employee' | 'Exam' | 'organization' | 'fromPosition' | 'toPosition'
        >
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    salary: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    currency: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    organization: number;

    @Expose()
    @IsOptional()
    @IsNumber()
    toPosition?: number | undefined;

    @Expose()
    @IsOptional()
    @IsNumber()
    fromPosition?: number | undefined;
}
