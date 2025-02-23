import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class ReviewsService {
    constructor(private readonly database: DatabaseService) {}

    async create(
        body: CreateReviewDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;

        return db.review.create({
            data: {
                ...body,
                createdFor: {
                    connect: {
                        id: body.createdFor,
                    },
                },
                createdBy: {
                    connect: {
                        id: body.createdBy,
                    },
                },
            },
            include: {
                createdBy: true,
                createdFor: true,
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
                            'rating',
                            'body',
                            'createdById',
                            'createdForId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.review.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.review.findFirst({
            where: {
                id,
            },
            include: {
                createdBy: true,
                createdFor: true,
            },
        });
        if (!response) throw new NotFoundException('cannot find review');
        return response;
    }

    async update(
        id: number,
        body: UpdateReviewDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.review.update({
            where: {
                id,
            },
            data: {
                ...body,
                createdFor: body.createdFor
                    ? {
                          connect: {
                              id: body.createdFor,
                          },
                      }
                    : undefined,
                createdBy: body.createdBy
                    ? {
                          connect: {
                              id: body.createdBy,
                          },
                      }
                    : undefined,
            },
            include: {
                createdBy: true,
                createdFor: true,
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
        return db.review.delete({
            where: { id },
        });
    }
}
