import { Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum QuestionType {
    SINGLE_CHOICE_QUESTION = 'SINGLE_CHOICE_QUESTION',
    MULTIPLE_CHOICE_QUESTION = 'MULTIPLE_CHOICE_QUESTION',
    ESSAY_QUESTION = 'ESSAY_QUESTION',
}

export class CreateQuestionDto
    implements Omit<Prisma.QuestionCreateInput, 'ExamStatus' | 'Options'>
{
    @IsNotEmpty()
    @IsNumber()
    examId: number;

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(QuestionType)
    type: string;
}
