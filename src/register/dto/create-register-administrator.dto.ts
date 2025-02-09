import { Matches } from 'class-validator';
import { CreateRegisterDto } from './create-register.dto';
import { CreateAdministratorDto } from 'src/administrator/dto/create-administrator.dto';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';
import { Expose } from 'class-transformer';

type RegisterAdministratorDto = Omit<CreateAdministratorDto, 'account'>;

export class CreateRegisterAdministratorDto
    extends CreateRegisterDto
    implements RegisterAdministratorDto
{
    @Expose()
    @Matches(AccountEnum.ADMINISTRATOR)
    role: AccountEnum;
}
