import { Promotion as PrismaPromotion } from '@prisma/client';
export class Promotion implements PrismaPromotion {
    id: number;
    type: string;
    examId: number | null;
    employeeId: number;
    fromPositionId: number;
    toPositionId: number;
    createdAt: Date;
    updatedAt: Date;
}
