import { Prisma } from '@prisma/client';
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
    @IsNotEmpty()
    person: number;

    @IsNotEmpty()
    organization: number;

    @IsNotEmpty()
    position: number;

    isTerminated?: boolean | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
