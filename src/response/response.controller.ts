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
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PassprtJWTGuard } from 'src/auth/guards/jwt.guard';
import { AllowRoles } from '@app/common/roles/decorators/roles.decorator';
import { ACCOUNT_ROLES_ENUM } from '@app/common/roles/enums/roles.enum';
import { RolesGuard } from '@app/common/roles/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateResponseDto } from './dto/create-response.dto';

@Controller('responses')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) {}

    @UseGuards(PassprtJWTGuard)
    @Get()
    findAll(@Query() query: ExpressQuery) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return this.responseService.findAll(query as any);
    }

    @UseGuards(PassprtJWTGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.EMPLOYEE)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post(':id/submit')
    submit(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateResponseDto,
    ) {
        return this.responseService.submitResponse(body);
    }
}
