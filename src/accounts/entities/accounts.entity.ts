import { Account as PrismaAccount } from '@prisma/client';
import { AccountEnum } from '../dto/create-account.dto';

export class Accounts implements PrismaAccount {
    id: number;
    name: string;
    email: string;
    password: string;
    role: AccountEnum;
    lastLogin: Date;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
