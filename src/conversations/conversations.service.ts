import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class ConversationsService {
    constructor(private readonly database: DatabaseService) {}

    async createConversation(body: CreateConversationDto) {
        return this.create(body);
    }

    findMessages(id: number) {
        console.log(id);
        throw new NotImplementedException('not yet done');
    }

    async findAll(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.conversation.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.conversation.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find conversation');
        return response;
    }

    async updateConversation(id: number, body: UpdateConversationDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { members, createdBy, ...rest } = body;
        return this.update(id, rest);
    }

    async removeMember(id: number, members: number[]) {
        return this.database.conversation.update({
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

    async addMember(id: number, members: number[]) {
        return this.database.conversation.update({
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

    async remove(id: number) {
        return this.delete(id);
    }

    async removeMany(createdBy: number) {
        return this.database.conversation.deleteMany({
            where: {
                createdById: createdBy,
            },
        });
    }

    async delete(id: number) {
        return this.database.conversation.delete({
            where: {
                id,
            },
        });
    }

    async create(body: CreateConversationDto) {
        return this.database.conversation.create({
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

    async update(id: number, body: UpdateConversationDto) {
        return this.database.conversation.update({
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
