import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateOrganizationDto
    implements
        Omit<
            Prisma.OrganizationCreateInput,
            'Employee' | 'Position' | 'Branch' | 'Exam' | 'Payment' | 'account'
        >
{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    taxId: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    account: number;

    @IsString()
    brief?: string | null | undefined;

    @IsString()
    avatar?: string | null | undefined;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
