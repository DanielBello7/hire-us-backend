import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class ResponseService {
    constructor(
        private readonly database: DatabaseService,
        private readonly progress: ProgressService,
    ) {}

    /** This checks if an employee has already answered a question */
    async alreadyExists(
        examid: number,
        employeeid: number,
        questionid: number,
    ): Promise<boolean> {
        const response = await this.database.response.findFirst({
            where: { examid, employeeid, questionid },
        });
        return !!response;
    }

    /** This submits a user's response to a particular question,
     * it checks if a user has answered the question before first, if yes, it updates the body,
     * and changes the selected option, if not it creates a new response.
     */
    async save(
        body: CreateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.alreadyExists(body.exam, body.employee, body.question)) {
            const response = await this.findByEmployeeIdAndQtnId(
                body.employee,
                body.question,
            );
            return this.update(response.id, { option: body.option });
        }
        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            const response = await this.create(body, db);
            const progress = await this.progress.findEmployeeStatus(
                body.employee,
                body.exam,
            );
            await this.progress.modify(
                progress.id,
                {
                    score: response.correct
                        ? (progress.score ?? 0) + 1
                        : progress.score,
                },
                db,
            );
            return response;
        });
    }

    /** This finds a response using the employee id and the question id */
    async findByEmployeeIdAndQtnId(employee: number, question: number) {
        const response = await this.database.response.findFirst({
            where: { employeeid: employee, questionid: question },
        });
        if (!response) throw new NotFoundException('Cannot find response');
        return response;
    }

    /** This updates a response but excludes some fields */
    async modify(
        id: number,
        updates: UpdateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, question, ...rest } = updates;
        return this.update(id, rest, database);
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
                            'questionId',
                            'employeeId',
                            'optionId',
                            'isCorrect',
                            'examId',
                            'body',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.response.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async create(
        body: CreateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.response.create({
            data: {
                ...body,
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
                exam: {
                    connect: {
                        id: body.exam,
                    },
                },
                option: {
                    connect: {
                        id: body.option,
                    },
                },
                question: {
                    connect: {
                        id: body.question,
                    },
                },
            },
        });
    }

    async findById(id: number) {
        const response = await this.database.response.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('response not found');
        return response;
    }

    async update(
        id: number,
        updates: UpdateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.response.update({
            where: {
                id,
            },
            data: {
                ...updates,
                employee: updates.employee
                    ? {
                          connect: {
                              id: updates.employee,
                          },
                      }
                    : undefined,
                exam: updates.exam
                    ? {
                          connect: {
                              id: updates.exam,
                          },
                      }
                    : undefined,
                option: updates.option
                    ? {
                          connect: {
                              id: updates.option,
                          },
                      }
                    : undefined,
                question: updates.question
                    ? {
                          connect: {
                              id: updates.question,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        await db.response.delete({
            where: {
                id,
            },
        });
    }
}
