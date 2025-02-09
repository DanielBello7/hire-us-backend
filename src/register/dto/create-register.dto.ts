import { Expose } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import {
    AccountEnum,
    CreateAccountDto,
} from 'src/accounts/dto/create-account.dto';

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
    @IsEnum(AccountEnum)
    role: AccountEnum;
}
