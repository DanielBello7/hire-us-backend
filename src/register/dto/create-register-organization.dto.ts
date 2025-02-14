import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateRegisterDto } from './create-register.dto';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { ACCOUNT_ROLES_ENUM } from 'src/roles/enums/roles.enum';

type RegisterOrganizationDto = Omit<CreateOrganizationDto, 'account'>;

export class CreateRegisterOrganizationDto
    extends CreateRegisterDto
    implements RegisterOrganizationDto
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Matches(ACCOUNT_ROLES_ENUM.ORGANIZATIONS)
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
    taxId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    brief?: string | null | undefined;
}
