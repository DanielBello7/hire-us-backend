import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
export class CreatePaymentDto
    implements Omit<Prisma.PaymentCreateInput, 'employee' | 'company'>
{
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    amount: number;
    @Expose()
    @IsNotEmpty()
    @IsString()
    currency: string;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    employee: number;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    company: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
