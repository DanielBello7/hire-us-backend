import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
export class CreateEmployeeDto
    implements
        Omit<
            Prisma.EmployeeCreateInput,
            | 'Exam'
            | 'ExamStatus'
            | 'Promotion'
            | 'CreatedBy'
            | 'CreatedFor'
            | 'Payment'
            | 'Branch'
            | 'company'
            | 'position'
            | 'person'
        >
{
    @Expose()
    @IsNotEmpty()
    person: number;
    @Expose()
    @IsNotEmpty()
    company: number;
    @Expose()
    @IsNotEmpty()
    position: number;
    @Expose()
    terminated?: boolean | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
