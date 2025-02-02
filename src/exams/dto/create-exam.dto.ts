import { Prisma } from '@prisma/client';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
export class CreateExamDto
    implements
        Omit<
            Prisma.ExamCreateInput,
            | 'Promotion'
            | 'organization'
            | 'eligiblePositions'
            | 'ineligibleEmployees'
        >
{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    availableAt: string | Date;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    startsAt: string | Date;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    endsAt: string | Date;

    @IsNotEmpty()
    @IsNumber()
    organization: number;

    @IsArray()
    @IsNumber({}, { each: true })
    eligiblePositions?: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    ineligibleEmployees?: number[];
}
