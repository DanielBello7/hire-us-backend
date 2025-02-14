import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LayoffEmployeeDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    reason: string;
}
