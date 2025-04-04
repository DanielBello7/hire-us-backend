import { Matches } from 'class-validator';
import { CreateSignupDto } from './create-signup.dto';
import { CreateAdminDto } from 'src/admins/dto/create-admins.dto';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import { Expose } from 'class-transformer';

type SignUpAdminDto = Omit<CreateAdminDto, 'account'>;

export class CreateSignUpAdminDto
    extends CreateSignupDto
    implements SignUpAdminDto
{
    @Expose()
    @Matches(ACCOUNT_ROLES_ENUM.ADMIN)
    role: ACCOUNT_ROLES_ENUM;
}
