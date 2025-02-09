import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateMessageDto
    implements Omit<Prisma.MessageCreateInput, 'createdBy' | 'conversation'>
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    body: string;

    @Expose()
    @IsOptional()
    @IsString()
    media?: string | null | undefined;

    @Expose()
    @IsOptional()
    @IsString()
    mediaType?: string | null | undefined;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    conversation: number;
}
