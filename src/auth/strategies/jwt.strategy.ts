import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidUser } from '../auth.service';
import { ACTIVE } from '@app/constants';

@Injectable()
export class PassportJWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: ACTIVE.JWT_SECRET,
            ignoreExpiration: false,
        });
    }

    validate(payload: ValidUser) {
        return payload;
    }
}
