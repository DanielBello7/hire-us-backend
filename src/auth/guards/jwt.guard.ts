import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassprtJWTGuard extends AuthGuard('jwt') {}
