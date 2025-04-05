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
import { CreateResponseDto } from './dto/create-response.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('responses')
export class ResponseController {
    constructor(private readonly response: ResponseService) {}

    @UseGuards(SessionGuard)
    @Get()
    get(@Query() query: Record<string, any>) {
        return this.response.get(query);
    }

    @AllowRoles(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(SessionGuard, RolesGuard)
    @Post(':id/submit/')
    submit(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateResponseDto,
    ) {
        return this.response.save(body);
    }
}
