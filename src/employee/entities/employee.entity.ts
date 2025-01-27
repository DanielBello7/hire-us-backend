import { Employee as PrismaEmployee } from '@prisma/client';

export class Employee implements PrismaEmployee {
    id: number;
    personId: number;
    organizationId: number;
    positionId: number | null;
    createdAt: Date;
    updatedAt: Date;
    isTerminated: boolean;
    examId: number | null;
}
