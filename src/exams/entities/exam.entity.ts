import { Exam as PrismaExam } from '@prisma/client';
export class Exam implements PrismaExam {
    id: number;
    title: string;
    description: string;
    companyid: number;
    availableAt: Date;
    startsAt: Date;
    questions: number;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
