import { Terminated as PrismaTerminated } from '@prisma/client';
export class Terminated implements PrismaTerminated {
    id: number;
    employeeId: number;
    organizationId: number;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
