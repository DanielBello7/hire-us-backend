import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { Prisma } from '@prisma/client';

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
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsIn(Object.values(AccountEnum))
    @IsNotEmpty()
    @IsString()
    role: AccountEnum;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    lastLogin?: string | Date | undefined;
    isEmailVerified: boolean | undefined;
}
