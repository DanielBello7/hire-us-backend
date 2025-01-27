import { Account as PrismaAccount } from '@prisma/client';

export class Accounts implements PrismaAccount {
    name: string;
    id: number;
    email: string;
    password: string;
    role: string;
    lastLogin: Date;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
