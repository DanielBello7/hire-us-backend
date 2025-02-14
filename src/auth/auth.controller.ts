import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, ValidatedUser } from './auth.service';
import { Request } from 'express';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassprtJWTGuard } from './guards/jwt.guard';

export type ExpressRequest = Request & {
    user: ValidatedUser;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Req() req: ExpressRequest) {
        return this.auth.signIn(req.user);
    }

    @Post('logout')
    @UseGuards(PassprtJWTGuard)
    logout(@Req() req: ExpressRequest) {
        console.log(req.user);
        return 'logout';
    }

    @Get('me')
    @UseGuards(PassprtJWTGuard)
    whoami(@Req() req: ExpressRequest) {
        return this.auth.getMe(req.user.accountId);
    }
}
