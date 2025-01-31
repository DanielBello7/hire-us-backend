import { Matches } from 'class-validator';
import { Prisma } from '@prisma/client';
import { CreateRegisterDto } from './create-register.dto';
import { CreateAdministratorDto } from 'src/administrator/dto/create-administrator.dto';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';

type RegisterAdministratorDto = Omit<CreateAdministratorDto, 'account'> &
    Omit<Prisma.AdministratorCreateInput, 'account'>;

export class CreateRegisterAdministratorDto
    extends CreateRegisterDto
    implements RegisterAdministratorDto
{
    @Matches(AccountEnum.ADMINISTRATOR)
    role: AccountEnum;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
