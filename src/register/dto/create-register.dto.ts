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
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEnum(AccountEnum)
    role: AccountEnum;
}
