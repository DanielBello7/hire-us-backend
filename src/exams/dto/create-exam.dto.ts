import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
export class CreateExamDto
    implements
        Omit<
            Prisma.ExamCreateInput,
            | 'Promotion'
            | 'company'
            | 'eligiblePositions'
            | 'ineligibleEmployees'
        >
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    title: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    description: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsDate()
    availableAt: string | Date;
    @Expose()
    @IsNumber()
    @IsOptional()
    questions?: number | undefined;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsDate()
    startsAt: string | Date;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsDate()
    endsAt: string | Date;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    company: number;
    @Expose()
    @IsArray()
    @IsNumber({}, { each: true })
    eligiblePositions?: number[];
    @Expose()
    @IsArray()
    @IsNumber({}, { each: true })
    ineligibleEmployees?: number[];
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
