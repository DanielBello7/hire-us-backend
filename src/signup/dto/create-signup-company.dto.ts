import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { CreateSignupDto } from './create-signup.dto';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

type SignUpCompanyDto = Omit<CreateCompanyDto, 'account'>;

export class CreateSignUpCompanyDto
    extends CreateSignupDto
    implements SignUpCompanyDto
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Matches(ACCOUNT_ROLES_ENUM.COMPANY)
    role: ACCOUNT_ROLES_ENUM;
    @Expose()
    @IsString()
    @IsNotEmpty()
    country: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    address: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    taxid: string;
    @Expose()
    @IsString()
    @IsNotEmpty()
    brief?: string | null | undefined;
}
