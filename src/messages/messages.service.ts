import { Query as ExpressQuery } from 'express-serve-static-core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class MessagesService {
    constructor(private readonly database: DatabaseService) {}

    async create(
        body: CreateMessageDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.message.create({
            data: {
                ...body,
                createdBy: {
                    connect: {
                        id: body.createdBy,
                    },
                },
                conversation: {
                    connect: {
                        id: body.conversation,
                    },
                },
            },
            include: {
                createdBy: true,
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
                            'body',
                            'media',
                            'mediaType',
                            'createdById',
                            'conversationId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.message.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findConversationMessages(convoId: number) {
        return this.database.message.findMany({
            where: {
                conversationId: convoId,
            },
            include: {
                createdBy: true,
            },
        });
    }

    async findOne(id: number) {
        const response = await this.database.message.findFirst({
            where: {
                id,
            },
            include: {
                createdBy: true,
            },
        });
        if (!response) throw new NotFoundException('cannot find message');
        return response;
    }

    async update(
        id: number,
        body: UpdateMessageDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.message.update({
            where: {
                id,
            },
            data: {
                ...body,
                conversation: body.conversation
                    ? {
                          connect: {
                              id: body.conversation,
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
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.message.delete({
            where: {
                id,
            },
        });
    }

    async deleteMany(
        conversation: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.message.deleteMany({
            where: {
                conversationId: conversation,
            },
        });
    }
}
