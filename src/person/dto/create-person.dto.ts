import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsEnum,
    IsOptional,
} from 'class-validator';

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
}

export class CreatePersonDto
    implements Omit<Prisma.PersonCreateInput, 'Employee' | 'account'>
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    taxId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    username: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    country: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEnum(GenderEnum)
    gender: string;

    @Expose()
    @IsNotEmpty()
    account: number;

    @Expose()
    @IsString()
    @IsOptional()
    avatar?: string | null | undefined;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
