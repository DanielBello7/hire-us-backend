import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateTerminatedDto
    implements Omit<Prisma.TerminatedCreateInput, 'company' | 'employee'>
{
    @Expose()
    @IsString()
    @IsNotEmpty()
    reason: string;
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    employee: number;
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    company: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
