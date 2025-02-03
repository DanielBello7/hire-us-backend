import { ExamStatus as PrismaExamStatus } from '@prisma/client';
export class ExamStatus implements PrismaExamStatus {
    id: number;
    employeeId: number;
    score: number | null;
    isCompleted: boolean;
    lastQuestionId: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
