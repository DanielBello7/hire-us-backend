import { Administrator as PrismaAdministrator } from '@prisma/client';

export class Administrator implements PrismaAdministrator {
    id: number;
    accountId: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
