import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class ResponseService {
    constructor(private readonly database: DatabaseService) {}

    async alreadyExists(
        examId: number,
        employeeId: number,
        questionId: number,
    ): Promise<boolean> {
        const response = await this.database.response.findFirst({
            where: {
                examId,
                employeeId,
                questionId,
            },
        });
        return !!response;
    }

    async setResponse(
        body: CreateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.alreadyExists(body.exam, body.employee, body.question))
            throw new BadRequestException('Response already recorded');
        return this.create(body, database);
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

    async findAll(query?: Record<string, string | number>) {
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

    async findOne(id: number) {
        const response = await this.database.response.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('response not found');
        return response;
    }

    updateResponse(
        id: number,
        updates: UpdateResponseDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, question, ...rest } = updates;
        return this.update(id, rest, database);
    }

    update(
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
