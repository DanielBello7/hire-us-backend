import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
} from 'class-validator';
import { CreateRegisterDto } from './create-register.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreatePersonDto, GenderEnum } from 'src/person/dto/create-person.dto';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';

type RegisterEmployeeDto = Omit<CreateEmployeeDto, 'account' | 'person'> &
    Omit<CreatePersonDto, 'account'>;

export class CreateRegisterEmployeeDto
    extends CreateRegisterDto
    implements RegisterEmployeeDto
{
    @Matches(AccountEnum.EMPLOYEE)
    @IsNotEmpty()
    role: AccountEnum;

    @IsNotEmpty()
    @IsString()
    taxId: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: string;

    @IsNotEmpty()
    @IsNumber()
    position: number;

    @IsNotEmpty()
    @IsNumber()
    organization: number;
}
