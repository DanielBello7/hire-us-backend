import { Person as PrismaPerson } from '@prisma/client';
export class Person implements PrismaPerson {
    id: number;
    taxid: string;
    name: string;
    accountid: number;
    email: string;
    username: string;
    country: string;
    address: string;
    gender: string;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}
