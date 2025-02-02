import { Question as PrismaQuestion } from '@prisma/client';
export class Question implements PrismaQuestion {
    id: number;
    examId: number;
    type: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}
