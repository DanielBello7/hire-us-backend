import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authentication: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string) {
        const response = await this.authentication.validate({
            email,
            password,
        });
        if (!response) throw new UnauthorizedException();
        return response;
    }
}
