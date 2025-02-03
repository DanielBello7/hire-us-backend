import { Prisma } from '@prisma/client';
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
    @IsEnum(PromotionTypeEnum)
    @IsNotEmpty()
    type: string;

    @IsOptional()
    @IsNumber()
    exam?: number;

    @IsNumber()
    @IsNotEmpty()
    employee: number;

    @IsNotEmpty()
    @IsNumber()
    fromPosition: number;

    @IsNumber()
    @IsNotEmpty()
    toPosition: number;
}
