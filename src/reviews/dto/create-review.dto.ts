import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
export class CreateReviewDto
    implements Omit<Prisma.ReviewCreateInput, 'createdBy' | 'createdFor'>
{
    @IsNotEmpty()
    @Max(5)
    @Min(1)
    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    body?: string | null | undefined;

    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @IsNotEmpty()
    @IsNumber()
    createdFor: number;
}
