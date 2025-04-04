import { Payment as PrismaPayment } from '@prisma/client';
export class Payment implements PrismaPayment {
    id: number;
    employeeid: number;
    amount: number;
    currency: string;
    companyid: number;
    createdAt: Date;
    updatedAt: Date;
}
