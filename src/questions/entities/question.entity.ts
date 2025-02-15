import { Question as PrismaQuestion } from '@prisma/client';
import { QuestionTypeEnum } from '../dto/create-question.dto';

export class Question implements PrismaQuestion {
    id: number;
    index: number;
    examId: number;
    type: QuestionTypeEnum;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}
