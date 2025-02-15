/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';
import { QuestionsService } from 'src/questions/questions.service';
import { OptionsService } from 'src/options/options.service';
import { ResponseService } from 'src/response/response.service';
import { ProgressService } from 'src/progress/progress.service';
import { ProgressEnum } from 'src/progress/dto/create-progress.dto';

@Injectable()
export class ExamsService {
    constructor(
        private readonly database: DatabaseService,
        private readonly options: OptionsService,
        private readonly question: QuestionsService,
        private readonly response: ResponseService,
        private readonly progress: ProgressService,
    ) {}

    async submit(examId: number, employeeId: number) {
        const status = await this.progress.findEmployeeStatus(
            employeeId,
            examId,
        );
        const exam = await this.findOne(examId);
        const responses = await this.response.findAll({ examId, employeeId });
        if (responses.length < exam.questions)
            throw new BadRequestException('exam not completed');
        const score = responses.filter((response) => response.isCorrect);
        return this.progress.updateProgress(status.id, {
            score: score.length,
            status: ProgressEnum.COMPLETED,
            isCompleted: true,
        });
    }

    async create(
        body: CreateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.exam.create({
            data: {
                ...body,
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
                eligiblePositions: body.eligiblePositions
                    ? {
                          connect: body.eligiblePositions?.map((item) => ({
                              id: item,
                          })),
                      }
                    : undefined,
                ineligibleEmployees: body.ineligibleEmployees
                    ? {
                          connect: body.ineligibleEmployees?.map((item) => ({
                              id: item,
                          })),
                      }
                    : undefined,
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
                            'title',
                            'description',
                            'organizationId',
                            'availableAt',
                            'startsAt',
                            'endsAt',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.exam.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.exam.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find exam');
        const questions = await this.question.getExamQuestions(id);
        return {
            ...response,
            Questions: questions,
        };
    }

    async updateExam(
        id: number,
        body: UpdateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const {
            organization,
            eligiblePositions,
            ineligibleEmployees,
            ...rest
        } = body;
        return this.update(id, rest, database);
    }

    async update(
        id: number,
        body: UpdateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.exam.update({
            where: {
                id,
            },
            data: {
                ...body,
                organization: body.organization
                    ? {
                          connect: {
                              id: body.organization,
                          },
                      }
                    : undefined,
                eligiblePositions: undefined,
                ineligibleEmployees: undefined,
            },
        });
    }

    async updateEligiblePositions(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.exam.update({
            where: {
                id,
            },
            data: {
                eligiblePositions: {
                    connect: addPositions.map((id) => ({ id })),
                    disconnect: removePositions.map((id) => ({ id })),
                },
            },
        });
    }

    async updateIneligibleEmployees(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.exam.update({
            where: {
                id,
            },
            data: {
                ineligibleEmployees: {
                    connect: addPositions.map((id) => ({ id })),
                    disconnect: removePositions.map((id) => ({ id })),
                },
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        await this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            await db.exam.delete({
                where: {
                    id,
                },
            });
            await this.question.removeExamQuestions(id, db);
            await this.options.removeMany(
                {
                    examId: id,
                },
                db,
            );
        });
    }
}
