import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';

@Injectable()
export class OptionsService {
    constructor(private readonly db: DatabaseService) {}

    /**
     * Create many options at once
     */
    async createMany(
        body: CreateOptionDto[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.option.createMany({
            data: body.map((option) => ({
                ...option,
                questionid: option.question,
                question: { connect: { id: option.question } },
            })),
        });
    }

    /**
     * Delete many question options, using filters.
     */
    async removeMany(
        filter: Partial<{ questionId: number; examid: number }>,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.option.deleteMany({
            where: filter,
        });
    }

    /**
     * Delete many question options, using questionIds,
     * takes in an array of question ids
     */
    async removeByIds(
        ids: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.option.deleteMany({
            where: {
                questionid: { in: ids },
            },
        });
    }

    /**
     * Update an option excluding certain items
     */
    async modify(
        id: number,
        body: UpdateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { question, ...rest } = body;
        return this.update(id, rest, database);
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
                            'questionid',
                            'body',
                            'description',
                            'correct',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.option.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.option.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException('cannot find option');
    }

    async create(
        body: CreateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.option.create({
            data: {
                ...body,
                question: { connect: { id: body.question } },
            },
        });
    }

    async update(
        id: number,
        body: UpdateOptionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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
        const db = database ?? this.db;
        return db.option.delete({ where: { id } });
    }
}
