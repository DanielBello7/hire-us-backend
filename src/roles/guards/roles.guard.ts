/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ACCOUNT_ROLES_ENUM } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ValidatedUser } from 'src/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const required = this.reflector.getAllAndOverride<ACCOUNT_ROLES_ENUM[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!required) return true;

        const request = context.switchToHttp().getRequest();
        const user: ValidatedUser = request.user;
        return matchRole(required, user.role);
    }
}

function matchRole(valid: ACCOUNT_ROLES_ENUM[], input: ACCOUNT_ROLES_ENUM) {
    if (valid.includes(input)) return true;
    return false;
}
