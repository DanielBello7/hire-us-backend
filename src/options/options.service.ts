import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class OptionsService {
    constructor(private readonly database: DatabaseService) {}

    /**
     * Create many options at once
     */
    async createMany(
        body: CreateOptionDto[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.option.createMany({
            data: body.map((option) => ({
                ...option,
                questionId: option.question,
                question: {
                    connect: {
                        id: option.question,
                    },
                },
            })),
        });
    }

    /**
     * Delete many question options, using filters.
     */
    async removeMany(
        filter: Partial<{ questionId: number; examId: number }>,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.option.deleteMany({
            where: filter,
        });
    }

    /**
     * Delete many question options, using questionIds,
     * takes in an array of question ids
     */
    async removeManyUsingInclusive(
        ids: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.option.deleteMany({
            where: {
                questionId: { in: ids },
            },
        });
    }

    /**
     * Update an option excluding certain items
     */
    async updateOption(
        id: number,
        body: UpdateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { question, ...rest } = body;
        return this.update(id, rest, database);
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
                            'questionId',
                            'body',
                            'description',
                            'isCorrect',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.option.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.option.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find option');
        return response;
    }

    async create(
        body: CreateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.option.create({
            data: {
                ...body,
                question: {
                    connect: {
                        id: body.question,
                    },
                },
            },
        });
    }

    async update(
        id: number,
        body: UpdateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.option.update({
            where: {
                id,
            },
            data: {
                ...body,
                question: body.question
                    ? {
                          connect: {
                              id: body.question,
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
        return db.option.delete({
            where: {
                id,
            },
        });
    }
}
