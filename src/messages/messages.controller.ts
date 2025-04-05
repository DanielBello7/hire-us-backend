import {
    ParseIntPipe,
    Controller,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    ParseFilePipeBuilder,
    HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messages: MessagesService) {}

    @UseGuards(SessionGuard)
    @UseInterceptors(FilesInterceptor('media'))
    @Post()
    create(
        @Body() body: CreateMessageDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(jpg|png|jpeg)$/,
                })
                .addMaxSizeValidator({
                    maxSize: 50 * 1024, // 50KB
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: true,
                }),
        )
        files: Express.Multer.File[],
    ) {
        return this.messages.save(body, files[0]);
    }

    @UseGuards(SessionGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.messages.remove(id);
    }
}
