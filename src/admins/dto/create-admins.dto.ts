import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';

export class CreateAdminDto
    implements Omit<Prisma.AdminCreateInput, 'account'>
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    account: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
