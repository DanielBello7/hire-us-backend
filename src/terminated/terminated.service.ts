import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTerminatedDto } from './dto/create-terminated.dto';
import { UpdateTerminatedDto } from './dto/update-terminated.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class TerminatedService {
    constructor(private readonly database: DatabaseService) {}

    /** update the terminated record excluding somethings */
    async updateTerminated(
        id: number,
        body: UpdateTerminatedDto,
        database?: PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, organization, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(body: CreateTerminatedDto, database?: PrismaDatabaseService) {
        const db = database ?? this.database;
        return db.terminated.create({
            data: {
                ...body,
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
                employee: {
                    connect: {
                        id: body.employee,
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
                            'organizationId',
                            'reason',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.terminated.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.terminated.findFirst({
            where: {
                id,
            },
        });
        if (!response)
            throw new NotFoundException('cannot find termination record');
        return response;
    }

    async update(
        id: number,
        body: UpdateTerminatedDto,
        database?: PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.terminated.update({
            where: { id },
            data: {
                ...body,
                employee: body.employee
                    ? {
                          connect: {
                              id: body.employee,
                          },
                      }
                    : undefined,
                organization: body.organization
                    ? {
                          connect: {
                              id: body.organization,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(id: number, database?: PrismaDatabaseService) {
        const db = database ?? this.database;
        return db.terminated.delete({ where: { id } });
    }
}
