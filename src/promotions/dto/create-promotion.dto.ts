import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export enum PromotionTypeEnum {
    EXAMINATION = 'EXAMINATION',
    ASSIGNMENTS = 'ASSIGNMENTS',
}
export class CreatePromotionDto
    implements
        Omit<
            Prisma.PromotionCreateInput,
            'toPosition' | 'fromPosition' | 'employee' | 'exam'
        >
{
    @Expose()
    @IsEnum(PromotionTypeEnum)
    @IsNotEmpty()
    type: string;

    @Expose()
    @IsOptional()
    @IsNumber()
    exam?: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    employee: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    fromPosition: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    toPosition: number;
}
