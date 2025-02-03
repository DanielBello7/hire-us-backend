import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreatePaymentDto
    implements Omit<Prisma.PaymentCreateInput, 'employee' | 'organization'>
{
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsNumber()
    employee: number;

    @IsNotEmpty()
    @IsNumber()
    organization: number;
}
