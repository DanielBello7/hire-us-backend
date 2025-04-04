import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
} from 'class-validator';
import { CreateSignupDto } from './create-signup.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreatePersonDto, GENDER_ENUM } from 'src/person/dto/create-person.dto';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import { Expose } from 'class-transformer';

type SignUpEmployeeDto = Omit<CreateEmployeeDto, 'account' | 'person'> &
    Omit<CreatePersonDto, 'account'>;

export class CreateSignUpEmployeeDto
    extends CreateSignupDto
    implements SignUpEmployeeDto
{
    @Expose()
    @Matches(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @IsNotEmpty()
    role: ACCOUNT_ROLES_ENUM;
    @Expose()
    @IsNotEmpty()
    @IsString()
    taxid: string;
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
    @IsEnum(GENDER_ENUM)
    gender: GENDER_ENUM;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    position: number;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    company: number;
}
