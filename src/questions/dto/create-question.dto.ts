import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum QuestionTypeEnum {
    SINGLE_CHOICE_QUESTION = 'SINGLE_CHOICE_QUESTION',
    MULTIPLE_CHOICE_QUESTION = 'MULTIPLE_CHOICE_QUESTION',
    ESSAY_QUESTION = 'ESSAY_QUESTION',
}

export class CreateQuestionDto
    implements Omit<Prisma.QuestionCreateInput, 'ExamStatus' | 'Options'>
{
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    examId: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    body: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEnum(QuestionTypeEnum)
    type: string;
}
