import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateMessageDto
    implements Omit<Prisma.MessageCreateInput, 'createdBy' | 'conversation'>
{
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsOptional()
    @IsString()
    media?: string | null | undefined;

    @IsOptional()
    @IsString()
    mediaType?: string | null | undefined;

    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @IsNotEmpty()
    @IsNumber()
    conversation: number;
}
