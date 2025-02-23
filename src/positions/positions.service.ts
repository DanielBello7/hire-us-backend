import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
    constructor(private readonly database: DatabaseService) {}

    async alreadyCreated(title: string, id: number): Promise<Position | false> {
        const response: Position[] = await this.database.$queryRaw`
            SELECT * FROM position 
            WHERE LOWER(title) = LOWER(${title}) 
            AND organizationId = ${id}
        `;
        if (response.length > 0) return response[0];
        return false;
    }

    async recordPosition(
        body: CreatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const response = await this.alreadyCreated(
            body.title,
            body.organization,
        );
        if (response) return response;
        return this.create(body, database);
    }

    async create(
        body: CreatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.position.create({
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
                successor: {
                    connect: {
                        id: body.successor,
                    },
                },
                predecessor: {
                    connect: {
                        id: body.predecessor,
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

    async updatePosition(
        id: number,
        body: UpdatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, ...rest } = body;
        return this.update(id, rest, database);
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.position.delete({
            where: { id },
        });
    }

    async update(
        id: number,
        body: UpdatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.position.update({
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
                successor: body.successor
                    ? {
                          connect: {
                              id: body.successor,
                          },
                      }
                    : undefined,
                predecessor: body.predecessor
                    ? {
                          connect: {
                              id: body.predecessor,
                          },
                      }
                    : undefined,
            },
        });
    }
}
