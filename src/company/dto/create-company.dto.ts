import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
export class CreateCompanyDto
    implements
        Omit<
            Prisma.CompanyCreateInput,
            'Employee' | 'Position' | 'Branch' | 'Exam' | 'Payment' | 'account'
        >
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    title: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    country: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    taxid: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string;
    @Expose()
    @IsNotEmpty()
    account: number;
    @Expose()
    @IsString()
    brief?: string | null | undefined;
    @Expose()
    @IsString()
    @IsOptional()
    avatar?: string | null | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
