import { Person as PrismaPerson } from '@prisma/client';

export class Person implements PrismaPerson {
    name: string;
    id: number;
    accountId: number;
    email: string;
    username: string;
    country: string;
    address: string;
    gender: string;
    avatar: string | null;
    idNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
