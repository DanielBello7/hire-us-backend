import { Organization as PrismaOrganization } from '@prisma/client';

export class Organization implements PrismaOrganization {
    id: number;
    accountId: number;
    title: string;
    email: string;
    country: string;
    address: string;
    avatar: string | null;
    brief: string | null;
    taxId: string;
    createdAt: Date;
    updatedAt: Date;
}
