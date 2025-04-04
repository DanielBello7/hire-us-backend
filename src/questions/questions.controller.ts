import {
    Controller,
    Get,
    Delete,
    Post,
    Patch,
    Body,
    ParseIntPipe,
    Param,
    UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_ROLES_ENUM, AllowRoles, RolesGuard } from '@app/roles';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questions: QuestionsService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAll() {
        return this.questions.get();
    }

    @UseGuards(SessionGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.questions.findById(id);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post()
    create(@Body() body: CreateQuestionDto) {
        return this.questions.create(body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateQuestionDto,
    ) {
        return this.questions.modify(id, body);
    }

    @UseGuards(SessionGuard)
    @AllowRoles(ACCOUNT_ROLES_ENUM.ADMIN, ACCOUNT_ROLES_ENUM.COMPANY)
    @UseGuards(AuthGuard(), RolesGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.questions.remove(id);
    }
}
