import { Question as PrismaQuestion } from '@prisma/client';
import { QuestionTypeEnum } from '../dto/create-question.dto';
export class Question implements PrismaQuestion {
    id: number;
    index: number;
    examid: number;
    type: QuestionTypeEnum;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}
