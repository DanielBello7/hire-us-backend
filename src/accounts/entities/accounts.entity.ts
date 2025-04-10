import { Account as PrismaAccount } from '@prisma/client';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

export class Accounts implements PrismaAccount {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    role: ACCOUNT_ROLES_ENUM;
    lastLogin: Date;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
