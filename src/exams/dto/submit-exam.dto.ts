import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitExamDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    employeeId: number;
}
