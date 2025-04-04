import { Option as PrismaOption } from '@prisma/client';
export class Option implements PrismaOption {
    id: number;
    questionid: number;
    body: string;
    examid: number;
    description: string | null;
    correct: boolean;
    createdAt: Date;
    updatedAt: Date;
}
