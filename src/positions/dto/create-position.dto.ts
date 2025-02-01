import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto
    implements
        Omit<
            Prisma.PositionCreateInput,
            'Employee' | 'Exam' | 'organization' | 'fromPosition' | 'toPosition'
        >
{
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    salary: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsNumber()
    organization: number;

    @IsOptional()
    @IsNumber()
    toPosition?: number | undefined;

    @IsOptional()
    @IsNumber()
    fromPosition?: number | undefined;
}
