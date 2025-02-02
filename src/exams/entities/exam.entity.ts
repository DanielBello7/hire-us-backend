import { Exam as PrismaExam } from '@prisma/client';
export class Exam implements PrismaExam {
    id: number;
    title: string;
    description: string;
    organizationId: number;
    availableAt: Date;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
