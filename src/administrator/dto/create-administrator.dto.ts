import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateAdministratorDto
    implements Omit<Prisma.AdministratorCreateInput, 'account'>
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    account: number;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
