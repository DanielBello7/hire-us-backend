import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
export class CreateUploadDto
    implements Omit<Prisma.UploadCreateInput, 'account'>
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    url: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    mimetype: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    tempid: string;
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    size: number;
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    account: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
