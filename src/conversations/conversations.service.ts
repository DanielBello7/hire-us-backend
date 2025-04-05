import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ConversationsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly messages: MessagesService,
    ) {}

    /** deletes a conversation and it's messages */
    async deleteConversation(id: number) {
        return this.db.$transaction(async (tx) => {
            await this.messages.deleteMany(id, tx);
            return this.remove(id, tx);
        });
    }

    /** get all the messages of a conversation */
    async getMsgs(id: number) {
        const response = await this.db.conversation.findFirst({
            where: {
                id,
            },
            include: {
                Message: true,
            },
        });
        if (!response) {
            throw new NotFoundException('conversation record not found');
        }
        return response;
    }

    /** create a conversation */
    async save(
        body: CreateConversationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.create(body, database);
    }

    /** update a conversation */
    async updateConversation(
        id: number,
        body: UpdateConversationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { members, createdBy, ...rest } = body;
        return this.update(id, rest, database);
    }

    /** remove a conversation member */
    async removeMember(
        id: number,
        members: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.update({
            where: {
                id,
            },
            data: {
                members:
                    members && members.length > 0
                        ? {
                              disconnect: members.map((member) => ({
                                  id: member,
                              })),
                          }
                        : undefined,
            },
        });
    }

    /** add a member to the conversation */
    async addMember(
        id: number,
        members: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.update({
            where: {
                id,
            },
            data: {
                members:
                    members && members.length > 0
                        ? {
                              connect: members.map((member) => ({
                                  id: member,
                              })),
                          }
                        : undefined,
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
                        ['id', 'createdBy', 'createdAt', 'updatedAt'].includes(
                            key,
                        ),
                    ),
                ),
            };
        }

        return this.db.conversation.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.conversation.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find conversation');
        return response;
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.delete(id, database);
    }

    async removeMany(
        createdBy: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.deleteMany({
            where: {
                createdByid: createdBy,
            },
        });
    }

    async delete(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.delete({
            where: {
                id,
            },
        });
    }

    async create(
        body: CreateConversationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.create({
            data: {
                ...body,
                createdBy: {
                    connect: {
                        id: body.createdBy,
                    },
                },
                members: {
                    connect: body.members.map((member) => ({
                        id: member,
                    })),
                },
            },
        });
    }

    async update(
        id: number,
        body: UpdateConversationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.conversation.update({
            where: {
                id,
            },
            data: {
                ...body,
                createdBy: body.createdBy
                    ? {
                          connect: {
                              id: body.createdBy,
                          },
                      }
                    : undefined,
                members: body.members ? {} : undefined,
            },
        });
    }
}
