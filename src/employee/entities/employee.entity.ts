import { Employee as PrismaEmployee } from '@prisma/client';
export class Employee implements PrismaEmployee {
    id: number;
    personid: number;
    companyid: number;
    positionid: number | null;
    terminated: boolean;
    examid: number | null;
    createdAt: Date;
    updatedAt: Date;
}
