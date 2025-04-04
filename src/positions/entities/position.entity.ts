import { Position as PrismaPosition } from '@prisma/client';
export class Position implements PrismaPosition {
    id: number;
    title: string;
    companyid: number;
    successorid: number | null;
    predecessor: number | null;
    salary: number;
    currency: string;
    description: string;
    examid: number | null;
    createdAt: Date;
    updatedAt: Date;
}
