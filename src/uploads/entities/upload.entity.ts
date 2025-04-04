import { Upload as PrismaUpload } from '@prisma/client';
export class Upload implements PrismaUpload {
    id: number;
    accountid: number;
    url: string;
    title: string;
    mimetype: string;
    tempid: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
}
