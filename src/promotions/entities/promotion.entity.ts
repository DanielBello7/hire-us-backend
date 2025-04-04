import { Promotion as PrismaPromotion } from '@prisma/client';
import { PromotionTypeEnum } from '../dto/create-promotion.dto';
export class Promotion implements PrismaPromotion {
    id: number;
    type: PromotionTypeEnum;
    examid: number | null;
    employeeid: number;
    fromPositionid: number;
    toPositionid: number;
    createdAt: Date;
    updatedAt: Date;
}
