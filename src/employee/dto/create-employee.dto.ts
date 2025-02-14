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
            | 'organization'
            | 'position'
            | 'person'
        >
{
    @Expose()
    @IsNotEmpty()
    person: number;

    @Expose()
    @IsNotEmpty()
    organization: number;

    @Expose()
    @IsNotEmpty()
    position: number;

    @Expose()
    isTerminated?: boolean | undefined;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
