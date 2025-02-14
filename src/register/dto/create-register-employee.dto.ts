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
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { Expose } from 'class-transformer';

type RegisterEmployeeDto = Omit<CreateEmployeeDto, 'account' | 'person'> &
    Omit<CreatePersonDto, 'account'>;

export class CreateRegisterEmployeeDto
    extends CreateRegisterDto
    implements RegisterEmployeeDto
{
    @Expose()
    @Matches(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @IsNotEmpty()
    role: ACCOUNT_ROLES_ENUM;

    @Expose()
    @IsNotEmpty()
    @IsString()
    taxId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    country: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    address: string;

    @Expose()
    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    position: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    organization: number;
}
