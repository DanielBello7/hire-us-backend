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
import { ExpressRequest } from 'src/auth/auth.controller';
import { ValidUser } from 'src/auth/auth.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploads: UploadsService) {}

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Req() res: Response) {
        return this.uploads.findUpload(id, res);
    }

    @UseGuards(SessionGuard)
    @Post('avatar')
    @UseInterceptors(FilesInterceptor('files'))
    create(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: ExpressRequest,
    ) {
        const user: ValidUser = req.user;
        return this.uploads.updateAvatar(user.accountId, files);
    }
}
