import { Terminated as PrismaTerminated } from '@prisma/client';
export class Terminated implements PrismaTerminated {
    id: number;
    employeeid: number;
    companyid: number;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
