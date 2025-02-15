import { Expose } from 'class-transformer';
import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateConversationDto {
    @Expose()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    members: number[];

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    createdBy: number;
}
