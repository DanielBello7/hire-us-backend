import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidatedUser } from '../auth.service';

@Injectable()
export class PassportJWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
            ignoreExpiration: false,
        });
    }

    validate(payload: ValidatedUser) {
        return payload;
    }
}
