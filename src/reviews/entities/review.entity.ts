import { Review as PrismaReview } from '@prisma/client';
export class Review implements PrismaReview {
    id: number;
    rating: number;
    body: string | null;
    createdById: number;
    createdForId: number;
    createdAt: Date;
    updatedAt: Date;
}
