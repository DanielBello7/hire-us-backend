import {
    IsBoolean,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';

export enum AccountEnum {
    ORGANIZATION = 'organization',
    EMPLOYEE = 'employee',
    ADMINISTRATOR = 'administrator',
}

export class CreateAccountDto
    implements
        Omit<
            Prisma.AccountCreateInput,
            | 'Person'
            | 'Administrator'
            | 'Organization'
            | 'Message'
            | 'CreatedBy'
            | 'ConversationMembers'
        >
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsIn(Object.values(AccountEnum))
    @IsNotEmpty()
    @IsString()
    role: AccountEnum;

    @Expose()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    isEmailVerified: boolean | undefined;
}
