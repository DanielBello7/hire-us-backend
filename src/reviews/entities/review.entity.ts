import { Review as PrismaReview } from '@prisma/client';
export class Review implements PrismaReview {
    id: number;
    rating: number;
    body: string | null;
    createdByid: number;
    createdForid: number;
    createdAt: Date;
    updatedAt: Date;
}
