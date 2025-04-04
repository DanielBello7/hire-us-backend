import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';

@Injectable()
export class ProgressService {
    constructor(private readonly db: DatabaseService) {}

    /** find the progress record for an employee using the exam id and the employee id */
    async findEmployeeStatus(employeeid: number, examid: number) {
        const response = await this.db.progress.findFirst({
            where: { employeeid, examid },
        });
        if (response) return response;
        throw new NotFoundException('cannot find status');
    }

    /** update the progress record excluding some fields */
    async modify(
        id: number,
        body: UpdateProgressDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(
        body: CreateProgressDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.progress.create({
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
                lastQuestion: undefined,
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
                            'employeeId',
                            'score',
                            'isCompleted',
                            'lastQuestionId',
                            'status',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.progress.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.progress.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException();
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.progress.delete({
            where: {
                id,
            },
        });
    }

    async update(
        id: number,
        body: UpdateProgressDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.progress.update({
            where: {
                id,
            },
            data: {
                ...body,
                employee: body.employee
                    ? {
                          connect: {
                              id: body.employee,
                          },
                      }
                    : undefined,
                exam: body.exam
                    ? {
                          connect: {
                              id: body.exam,
                          },
                      }
                    : undefined,
                lastQuestion: body.lastQuestion
                    ? {
                          connect: {
                              id: body.lastQuestion,
                          },
                      }
                    : undefined,
            },
        });
    }
}
