import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBranchDto
    implements Omit<Prisma.BranchCreateInput, 'manager' | 'organization'>
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
    organization: number;

    @Expose()
    manager?: number;

    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
