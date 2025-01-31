import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Prisma } from '@prisma/client';
import { CreateRegisterDto } from './create-register.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { AccountEnum } from 'src/accounts/dto/create-account.dto';

type RegisterEmployeeDto = Omit<CreateEmployeeDto, 'account' | 'person'> &
    Omit<
        Prisma.EmployeeCreateInput,
        | 'account'
        | 'Exam'
        | 'Branch'
        | 'ExamStatus'
        | 'Promotion'
        | 'CreatedBy'
        | 'CreatedFor'
        | 'Payment'
        | 'organization'
        | 'person'
    > &
    Omit<CreatePersonDto, 'account' | 'positionId' | 'position'>;

export class CreateRegisterEmployeeDto
    extends CreateRegisterDto
    implements RegisterEmployeeDto
{
    @Matches(AccountEnum.EMPLOYEE)
    @IsNotEmpty()
    role: AccountEnum;

    @IsNotEmpty()
    @IsNumber()
    position: number;

    @IsNotEmpty()
    @IsNumber()
    organization: number;
}
