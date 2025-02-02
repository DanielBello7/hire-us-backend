import { Prisma } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateOptionDto
    implements Omit<Prisma.OptionCreateInput, 'question'>
{
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsString()
    description?: string | null | undefined;

    @IsNotEmpty()
    @IsNumber()
    question: number;

    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;
}
