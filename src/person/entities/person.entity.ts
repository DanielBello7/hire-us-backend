import { Person as PrismaPerson } from '@prisma/client';

export class Person implements PrismaPerson {
    taxId: string;
    name: string;
    id: number;
    accountId: number;
    email: string;
    username: string;
    country: string;
    address: string;
    gender: string;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}
