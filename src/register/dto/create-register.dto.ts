import { Expose } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

export class CreateRegisterDto
    implements Omit<CreateAccountDto, 'isEmailVerified'>
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @IsNotEmpty()
    @IsEnum(ACCOUNT_ROLES_ENUM)
    role: ACCOUNT_ROLES_ENUM;
}
