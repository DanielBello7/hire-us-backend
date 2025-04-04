import { Company as PrismaCompany } from '@prisma/client';
export class Company implements PrismaCompany {
    id: number;
    accountid: number;
    title: string;
    email: string;
    country: string;
    address: string;
    avatar: string | null;
    brief: string | null;
    taxid: string;
    createdAt: Date;
    updatedAt: Date;
}
