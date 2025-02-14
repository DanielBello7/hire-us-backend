import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class ProgressService {
    constructor(private readonly database: DatabaseService) {}

    async create(
        body: CreateProgressDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
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

        return this.database.progress.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.progress.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find status');
        return response;
    }

    async updateProgress(
        id: number,
        body: UpdateProgressDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, ...rest } = body;
        return this.update(id, rest, database);
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
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
        else db = this.database;
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
            },
        });
    }
}
