import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class PromotionsService {
    constructor(private readonly database: DatabaseService) {}

    promote() {
        throw new NotImplementedException('not yet done');
    }

    employeePromotion(id: number) {
        console.log(id);
        throw new NotImplementedException('not done yet');
    }

    async create(
        body: CreatePromotionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.promotion.create({
            data: {
                ...body,
                fromPosition: {
                    connect: {
                        id: body.fromPosition,
                    },
                },
                toPosition: {
                    connect: {
                        id: body.toPosition,
                    },
                },
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
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
                            'type',
                            'examId',
                            'employeeId',
                            'fromPositionId',
                            'toPositionId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.promotion.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.promotion.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find promotion');
        return response;
    }

    async update(
        id: number,
        body: UpdatePromotionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.promotion.update({
            where: {
                id,
            },
            data: {
                ...body,
                exam: body.exam ? { connect: { id: body.exam } } : undefined,
                employee: body.employee
                    ? { connect: { id: body.employee } }
                    : undefined,
                fromPosition: body.fromPosition
                    ? { connect: { id: body.fromPosition } }
                    : undefined,
                toPosition: body.toPosition
                    ? { connect: { id: body.toPosition } }
                    : undefined,
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.promotion.delete({
            where: {
                id,
            },
        });
    }
}
