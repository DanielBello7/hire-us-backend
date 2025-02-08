import { Promotion as PrismaPromotion } from '@prisma/client';
import { PromotionTypeEnum } from '../dto/create-promotion.dto';
export class Promotion implements PrismaPromotion {
    id: number;
    type: PromotionTypeEnum;
    examId: number | null;
    employeeId: number;
    fromPositionId: number;
    toPositionId: number;
    createdAt: Date;
    updatedAt: Date;
}
