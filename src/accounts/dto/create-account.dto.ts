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
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

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
    @IsIn(Object.values(ACCOUNT_ROLES_ENUM))
    @IsNotEmpty()
    @IsString()
    role: ACCOUNT_ROLES_ENUM;

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

    avatar?: string | null | undefined;
    lastLogin?: string | Date | undefined;
}
