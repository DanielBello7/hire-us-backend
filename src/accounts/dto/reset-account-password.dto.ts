import { Expose } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';

export class ResetAccountPasswordDto {
    @Expose()
    @IsString()
    @IsStrongPassword()
    newPassword: string;
}
