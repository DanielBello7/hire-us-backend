import { Progress as PrismaProgress } from '@prisma/client';
export class Progress implements PrismaProgress {
    id: number;
    employeeId: number;
    score: number | null;
    isCompleted: boolean;
    lastQuestionId: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
