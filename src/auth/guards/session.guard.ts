/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private readonly jwtservice: JwtService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = request.session.token;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            request.user = await this.jwtservice.verifyAsync(token);
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}
