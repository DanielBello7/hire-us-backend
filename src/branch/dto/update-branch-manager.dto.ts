import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBranchManagerDto {
    @IsNotEmpty()
    @IsNumber()
    manager: number;
}
