import { Prisma } from '@prisma/client';
import { CreateRegisterDto } from './create-register.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { IsNotEmpty, IsString } from 'class-validator';

type RegisterOrganizationDto = Omit<CreateOrganizationDto, 'account'> &
    Omit<
        Prisma.OrganizationCreateInput,
        'Employee' | 'Position' | 'Branch' | 'Exam' | 'Payment' | 'account'
    >;

export class CreateRegisterOrganizationDto
    extends CreateRegisterDto
    implements RegisterOrganizationDto
{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    taxId: string;

    brief?: string | null | undefined;
}
