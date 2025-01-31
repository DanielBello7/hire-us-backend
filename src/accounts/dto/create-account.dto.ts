import {
    IsBoolean,
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

    @IsBoolean()
    @IsNotEmpty()
    isEmailVerified: boolean | undefined;
}
