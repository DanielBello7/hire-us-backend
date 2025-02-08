import { Query as ExpressQuery } from 'express-serve-static-core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessagesService {
    constructor(private readonly database: DatabaseService) {}
    async create(body: CreateMessageDto) {
        return this.database.message.create({
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
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.message.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
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

    async update(id: number, body: UpdateMessageDto) {
        return this.database.message.update({
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

    async remove(id: number) {
        return this.database.message.delete({
            where: {
                id,
            },
        });
    }

    async deleteMany(conversation: number) {
        return this.database.message.deleteMany({
            where: {
                conversationId: conversation,
            },
        });
    }
}
