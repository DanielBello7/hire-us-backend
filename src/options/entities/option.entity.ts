import { Option as PrismaOption } from '@prisma/client';
export class Option implements PrismaOption {
    id: number;
    questionId: number;
    body: string;
    examId: number;
    description: string | null;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
}
