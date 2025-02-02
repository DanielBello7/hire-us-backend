import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class QuestionsService {
    constructor(private readonly database: DatabaseService) {}

    submitQuestion(id: number, body: any) {
        throw new NotImplementedException('not yet complete');
    }

    saveQuestion() {
        throw new NotImplementedException('not yet complete');
    }

    deleteQuestions(id: number) {
        throw new NotImplementedException('not yet complete');
    }

    async create(body: CreateQuestionDto) {
        return this.database.question.create({
            data: {
                ...body,
            },
        });
    }

    async findAll() {
        return this.database.question.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.question.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('question not found');
        return response;
    }

    async update(id: number, body: UpdateQuestionDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { examId, ...rest } = body;
        return this.database.question.update({
            where: {
                id,
            },
            data: {
                ...rest,
            },
        });
    }

    async remove(id: number) {
        return this.database.question.delete({
            where: {
                id,
            },
        });
    }
}
