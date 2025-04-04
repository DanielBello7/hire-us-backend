import { Branch as PrismaBranch } from '@prisma/client';
export class Branch implements PrismaBranch {
    id: number;
    country: string;
    address: string;
    companyid: number;
    managerid: number | null;
    createdAt: Date;
    updatedAt: Date;
}
