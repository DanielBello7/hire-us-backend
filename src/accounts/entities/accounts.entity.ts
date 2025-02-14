import { Account as PrismaAccount } from '@prisma/client';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';

export class Accounts implements PrismaAccount {
    id: number;
    name: string;
    email: string;
    password: string;
    role: ACCOUNT_ROLES_ENUM;
    lastLogin: Date;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
