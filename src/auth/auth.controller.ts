import {
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Session,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService, ValidatedUser } from './auth.service';
import { Request, Response } from 'express';
import { PassprtJWTGuard } from './guards/jwt.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';

export type ExpressRequest = Request & {
    user: ValidatedUser;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(
        @Req() req: ExpressRequest,
        @Res() res: Response,
        @Session() session: Record<string, any>,
    ) {
        const response = this.auth.signIn(req.user);
        session.token = response.token;
        res.json(response);
    }

    @Post('logout')
    @UseGuards(PassprtJWTGuard)
    logout(@Session() session: Record<string, any>, @Res() res: Response) {
        session.destroy((error: any) => {
            if (error) throw new InternalServerErrorException(error);
            res.json({
                msg: 'logout successful',
            });
        });
    }

    @Get('me')
    @UseGuards(PassprtJWTGuard)
    whoami(@Req() req: ExpressRequest) {
        return this.auth.getMe(req.user.accountId);
    }
}
