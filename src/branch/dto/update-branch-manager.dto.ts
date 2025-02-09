import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBranchManagerDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    manager: number;
}
