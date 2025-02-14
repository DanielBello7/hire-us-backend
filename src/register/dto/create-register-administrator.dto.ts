import { Matches } from 'class-validator';
import { CreateRegisterDto } from './create-register.dto';
import { CreateAdministratorDto } from 'src/administrator/dto/create-administrator.dto';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { Expose } from 'class-transformer';

type RegisterAdministratorDto = Omit<CreateAdministratorDto, 'account'>;

export class CreateRegisterAdministratorDto
    extends CreateRegisterDto
    implements RegisterAdministratorDto
{
    @Expose()
    @Matches(ACCOUNT_ROLES_ENUM.ADMINISTRATOR)
    role: ACCOUNT_ROLES_ENUM;
}
