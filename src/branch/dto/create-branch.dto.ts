import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBranchDto
    implements Omit<Prisma.BranchCreateInput, 'manager' | 'organization'>
{
    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsNumber()
    organization: number;

    manager?: number;
}
