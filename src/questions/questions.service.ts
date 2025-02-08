import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class QuestionsService {
    constructor(private readonly database: DatabaseService) {}

    submitQuestion(id: number, body: any) {
        console.log(id, body);
        throw new NotImplementedException('not yet complete');
    }

    saveQuestion() {
        throw new NotImplementedException('not yet complete');
    }

    deleteQuestions(id: number) {
        console.log(id);
        throw new NotImplementedException('not yet complete');
    }

    async create(body: CreateQuestionDto) {
        return this.database.question.create({
            data: {
                ...body,
            },
        });
    }

    async findAll(query?: ExpressQuery) {
        let pageNum = 1;
        let pickNum = 5;

        let options = {};

        let skip = pickNum * (pageNum - 1);

        if (query) {
            const { page, pick } = query;
            pageNum = Number(page ?? 1);
            pickNum = Number(pick ?? 5);
            skip = pickNum * (pageNum - 1);
            options = {
                ...options,
                ...Object.fromEntries(
                    Object.entries(query).filter(([key]) =>
                        [
                            'id',
                            'examId',
                            'type',
                            'body',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.question.findMany({
            where: options,
            skip,
            take: pickNum,
        });
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

    async updateQuestion(id: number, body: UpdateQuestionDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { examId, ...rest } = body;
        return this.update(id, rest);
    }

    async update(id: number, body: UpdateQuestionDto) {
        return this.database.question.update({
            where: {
                id,
            },
            data: body,
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
