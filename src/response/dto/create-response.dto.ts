import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateResponseDto
    implements
        Omit<
            Prisma.ResponseCreateInput,
            'question' | 'employee' | 'option' | 'exam'
        >
{
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    exam: number;

    @Expose()
    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;

    @Expose()
    @IsOptional()
    @IsString()
    body?: string | null | undefined;

    @Expose()
    @IsOptional()
    @IsNumber()
    option?: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    question: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    employee: number;
}
