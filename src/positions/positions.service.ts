import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
    constructor(private readonly db: DatabaseService) {}

    /** check if a position has already been recorded */
    async alreadyCreated(title: string, id: number): Promise<Position | false> {
        const response: Position[] = await this.db.$queryRaw`
            SELECT * FROM position 
            WHERE LOWER(title) = LOWER(${title}) 
            AND organizationId = ${id}
        `;
        if (response.length > 0) return response[0];
        return false;
    }

    /** save a position to the database */
    async recordPosition(
        body: CreatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const response = await this.alreadyCreated(body.title, body.company);
        if (response) return response;
        return this.create(body, database);
    }

    /** update a position record */
    async modify(
        id: number,
        body: UpdatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { company: organization, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(
        body: CreatePositionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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
                company: {
                    connect: {
                        id: body.company,
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
                            'companyid',
                            'successor',
                            'predecessor',
                            'salary',
                            'currency',
                            'description',
                            'examid',
                            'email',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.position.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.position.findFirst({
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
        else db = this.db;
        return db.position.update({
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
