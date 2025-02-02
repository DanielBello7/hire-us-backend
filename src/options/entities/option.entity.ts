import { Option as PrismaOption } from '@prisma/client';
export class Option implements PrismaOption {
    id: number;
    questionId: number;
    body: string;
    description: string | null;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
}
