/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { QuestionsService } from 'src/questions/questions.service';
import { OptionsService } from 'src/options/options.service';
import { ResponseService } from 'src/response/response.service';
import { ProgressService } from 'src/progress/progress.service';
import { PROGRESS_ENUM } from 'src/progress/dto/create-progress.dto';

@Injectable()
export class ExamsService {
    constructor(
        private readonly options: OptionsService,
        private readonly question: QuestionsService,
        private readonly db: DatabaseService,
        private readonly response: ResponseService,
        private readonly progress: ProgressService,
    ) {}

    /**
     * This submits an exam by confirming the employee has taken all questions,
     * and computes the final result to set in the progress status,
     * it also sets the status of the progress to completed
     */
    async submit(examid: number, employeeid: number) {
        const status = await this.progress.findEmployeeStatus(
            employeeid,
            examid,
        );
        const exam = await this.findById(examid);
        const responses = await this.response.findAll({
            examid,
            employeeid,
        });
        if (responses.length < exam.questions)
            throw new BadRequestException('Exam not completed');
        const score = responses.filter((response) => response.correct);
        return this.progress.modify(status.id, {
            score: score.length,
            status: PROGRESS_ENUM.COMPLETED,
            completed: true,
        });
    }

    /**
     * This updates the document of an exam record
     */
    async modify(
        id: number,
        body: UpdateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const {
            company: organization,
            eligiblePositions,
            ineligibleEmployees,
            ...rest
        } = body;
        return this.update(id, rest, database);
    }

    /**
     * This updates the total number of available questions for an exam
     */
    async updateExamQuestionCount(id: number, amount: number) {
        const exam = await this.db.exam.findFirst({
            where: { id },
        });
        if (!exam) throw new NotFoundException('Cannot find exam');
        return this.update(id, { questions: exam.questions + amount });
    }

    /**
     * This updates the list of those who can take this exam
     */
    async updateEligiblePositions(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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

    /**
     * This updates the list of employees who are exempted from taking this exam
     */
    async updateIneligibleEmployees(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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

    async get(query: Record<string, any> = {}) {
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
                            'companyid',
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

        return this.db.exam.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.exam.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find exam');
        const questions = await this.question.getExamQuestionsUsingExamId(id);
        return {
            ...response,
            Questions: questions,
        };
    }

    async create(
        body: CreateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.exam.create({
            data: {
                ...body,
                company: {
                    connect: {
                        id: body.company,
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

    async update(
        id: number,
        body: UpdateExamDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.exam.update({
            where: {
                id,
            },
            data: {
                ...body,
                company: body.company
                    ? {
                          connect: {
                              id: body.company,
                          },
                      }
                    : undefined,
                eligiblePositions: undefined,
                ineligibleEmployees: undefined,
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        await this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            await db.exam.delete({
                where: {
                    id,
                },
            });
            await this.question.deleteQuestionsUsingExamId(id, db);
            await this.options.removeMany(
                {
                    examid: id,
                },
                db,
            );
        });
    }
}
