import { Administrator as PrismaAdministrator } from '@prisma/client';

export class Administrator implements PrismaAdministrator {
    name: string;
    id: number;
    accountId: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
