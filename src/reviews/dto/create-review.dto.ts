import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
export class CreateReviewDto
    implements Omit<Prisma.ReviewCreateInput, 'createdBy' | 'createdFor'>
{
    @Expose()
    @IsNotEmpty()
    @Max(5)
    @Min(1)
    @IsNumber()
    rating: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    body?: string | null | undefined;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    createdFor: number;
}
