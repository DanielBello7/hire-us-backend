import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
}

export class CreatePersonDto
    implements Omit<Prisma.PersonCreateInput, 'Employee' | 'account'>
{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(GenderEnum)
    gender: string;

    @IsString()
    @IsNotEmpty()
    idNumber: string;

    @IsNotEmpty()
    account: number;

    avatar?: string | null | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
