import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export enum AccountType {
    ORGANIZATION = 'organization',
    EMPLOYEE = 'employee',
    ADMINISTRATOR = 'administrator',
}

export class CreateAccountDto {
    /** @IsIn(Object.values(AccountType)) */
    @IsNotEmpty()
    @IsString()
    @IsEnum(AccountType)
    role: AccountType;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;
}
/**
{
    role: AccountType;
    email: string;
    password: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
}
*/
