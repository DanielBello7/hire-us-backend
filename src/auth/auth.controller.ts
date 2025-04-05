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
import { AuthService, ValidUser } from './auth.service';
import { Request, Response } from 'express';
import { PassprtJWTGuard } from './guards/jwt.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { SessionGuard } from './guards/session.guard';

export type ExpressRequest = Request & {
    user: ValidUser;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @UseGuards(PassportLocalGuard)
    @Post('signin')
    login(
        @Req() req: ExpressRequest,
        @Res() res: Response,
        @Session() session: Record<string, any>,
    ) {
        const response = this.auth.sign_in(req.user);
        session.token = response.token;
        res.json(response);
    }

    @UseGuards(PassprtJWTGuard)
    @Post('signout')
    logout(@Session() session: Record<string, any>, @Res() res: Response) {
        session.destroy((error: any) => {
            if (error) throw new InternalServerErrorException(error);
            res.json({
                msg: 'logout successful',
            });
        });
    }

    @UseGuards(SessionGuard)
    @Get('me')
    whoami(@Req() req: ExpressRequest) {
        return this.auth.getMe(req.user.accountId);
    }
}
