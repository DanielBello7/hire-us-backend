import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateRegisterDto } from './create-register.dto';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';
import { Expose } from 'class-transformer';

type RegisterOrganizationDto = Omit<CreateOrganizationDto, 'account'>;

export class CreateRegisterOrganizationDto
    extends CreateRegisterDto
    implements RegisterOrganizationDto
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Matches(AccountEnum.ORGANIZATION)
    role: AccountEnum;

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
    taxId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    brief?: string | null | undefined;
}
