import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateRegisterDto } from './create-register.dto';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';

type RegisterOrganizationDto = Omit<CreateOrganizationDto, 'account'>;

export class CreateRegisterOrganizationDto
    extends CreateRegisterDto
    implements RegisterOrganizationDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(AccountEnum.ORGANIZATION)
    role: AccountEnum;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    taxId: string;

    @IsString()
    @IsNotEmpty()
    brief?: string | null | undefined;
}
