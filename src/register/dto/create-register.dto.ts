import {
    IsEmail,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { Prisma } from '@prisma/client';
import { CreatePersonDto, GenderEnum } from 'src/person/dto/create-person.dto';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';

type RegisterAccountDto = Omit<CreatePersonDto, 'account'> &
    Omit<
        Prisma.AccountCreateInput,
        | 'Person'
        | 'Administrator'
        | 'Organization'
        | 'Message'
        | 'CreatedBy'
        | 'ConversationMembers'
    >;

export class CreateRegisterDto implements RegisterAccountDto {
    @IsEnum(GenderEnum)
    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    idNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    username: string;

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

    avatar?: string | null | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    lastLogin?: string | Date | undefined;
    isEmailVerified?: boolean | undefined;
}
