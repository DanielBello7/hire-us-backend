import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { ExpressRequest } from 'src/auth/auth.controller';
import { ValidatedUser } from 'src/auth/auth.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploads: UploadsService) {}

    @UseGuards(PassprtJWTGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Req() res: Response) {
        return this.uploads.findUpload(id, res);
    }

    @UseGuards(PassprtJWTGuard)
    @Post('avatar')
    @UseInterceptors(FilesInterceptor('files'))
    create(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: ExpressRequest,
    ) {
        const user: ValidatedUser = req.user;
        return this.uploads.updateAvatar(user.accountId, files);
    }
}
