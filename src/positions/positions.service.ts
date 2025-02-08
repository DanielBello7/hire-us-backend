import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class PositionsService {
    constructor(private readonly database: DatabaseService) {}

    async create(body: CreatePositionDto) {
        return this.database.position.create({
            data: {
                ...body,
                fromPosition: body.fromPosition
                    ? {
                          connect: {
                              id: body.fromPosition,
                          },
                      }
                    : undefined,
                toPosition: body.toPosition
                    ? {
                          connect: {
                              id: body.toPosition,
                          },
                      }
                    : undefined,
                organization: {
                    connect: {
                        id: body.organization,
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
                            'title',
                            'organizationId',
                            'successorId',
                            'predecessor',
                            'salary',
                            'currency',
                            'description',
                            'examId',
                            'email',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.position.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.position.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find position');
        return response;
    }

    async updatePosition(id: number, body: UpdatePositionDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, ...rest } = body;
        return this.update(id, rest);
    }

    async remove(id: number) {
        return this.database.position.delete({
            where: { id },
        });
    }

    async update(id: number, body: UpdatePositionDto) {
        return this.database.position.update({
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
                fromPosition: body.fromPosition
                    ? {
                          connect: {
                              id: body.fromPosition,
                          },
                      }
                    : undefined,
                toPosition: body.toPosition
                    ? {
                          connect: {
                              id: body.toPosition,
                          },
                      }
                    : undefined,
            },
        });
    }
}
