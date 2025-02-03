import { Payment as PrismaPayment } from '@prisma/client';
export class Payment implements PrismaPayment {
    id: number;
    employeeId: number;
    amount: number;
    currency: string;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
}
