import { Position as PrismaPosition } from '@prisma/client';

export class Position implements PrismaPosition {
    id: number;
    title: string;
    organizationId: number;
    successorId: number | null;
    predecessor: number | null;
    salary: number;
    currency: string;
    description: string;
    examId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
