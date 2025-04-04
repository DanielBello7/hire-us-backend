import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { AuthGuard } from '@nestjs/passport';
import { CreateResponseDto } from './dto/create-response.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('responses')
export class ResponseController {
    constructor(private readonly response: ResponseService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.response.get(query);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post(':id/submit/')
    submit(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateResponseDto,
    ) {
        return this.response.submitResponse(body);
    }
}
