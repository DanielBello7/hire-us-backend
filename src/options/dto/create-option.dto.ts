import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateOptionDto
    implements Omit<Prisma.OptionCreateInput, 'question'>
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    body: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    description?: string | null | undefined;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    examid: number;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    question: number;
    @Expose()
    @IsNotEmpty()
    @IsBoolean()
    correct: boolean;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
