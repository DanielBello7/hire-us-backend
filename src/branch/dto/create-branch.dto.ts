import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBranchDto
    implements Omit<Prisma.BranchCreateInput, 'manager' | 'company'>
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    country: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    company: number;
    @Expose()
    manager?: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
