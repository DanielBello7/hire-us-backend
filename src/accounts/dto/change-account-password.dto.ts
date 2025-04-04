import { Expose } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';

export class ChangeAccountPasswordDto {
    @Expose()
    @IsString()
    @IsStrongPassword()
    newPassword: string;
    @Expose()
    @IsString()
    oldPassword: string;
}
