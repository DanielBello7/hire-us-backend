import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTerminatedDto } from './dto/create-terminated.dto';
import { UpdateTerminatedDto } from './dto/update-terminated.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';

@Injectable()
export class TerminatedService {
    constructor(private readonly db: DatabaseService) {}

    /** update the terminated record excluding somethings */
    async modify(
        id: number,
        body: UpdateTerminatedDto,
        database?: PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, company, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(body: CreateTerminatedDto, database?: PrismaDatabaseService) {
        const db = database ?? this.db;
        return db.terminated.create({
            data: {
                ...body,
                company: {
                    connect: {
                        id: body.company,
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
                            'employeeid',
                            'companyid',
                            'reason',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.terminated.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.terminated.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException();
    }

    async update(
        id: number,
        body: UpdateTerminatedDto,
        database?: PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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
                company: body.company
                    ? {
                          connect: {
                              id: body.company,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(id: number, database?: PrismaDatabaseService) {
        const db = database ?? this.db;
        return db.terminated.delete({ where: { id } });
    }
}
