import { Admin as PrismaAdmin } from '@prisma/client';
export class Admin implements PrismaAdmin {
    id: number;
    accountid: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
