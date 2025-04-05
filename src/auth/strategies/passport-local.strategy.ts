import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authentication: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string) {
        const response = await this.authentication.validate({
            email: username,
            password,
        });
        if (!response) throw new UnauthorizedException();
        return response;
    }
}
