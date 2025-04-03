import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class MessagesService {
    constructor(
        private readonly database: DatabaseService,
        private readonly uploads: UploadsService,
    ) {}

    /** find the messages for a particular conversation */
    async findConversationMessages(conversation: number) {
        return this.database.message.findMany({
            where: {
                conversationId: conversation,
            },
            include: {
                createdBy: true,
            },
        });
    }

    /** save a message with a media upload or none */
    async saveMessage(
        body: CreateMessageDto,
        file?: Express.Multer.File,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let uri: string | null = null;
        let datatype: string | null = null;
        if (file) {
            const response = await this.uploads.saveFile(body.createdBy, file);
            uri = response.url;
            datatype = response.mimetype;
        }
        return this.create(
            {
                ...body,
                media: uri,
                mediaType: datatype,
            },
            database,
        );
    }

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

    async findMessages(query?: Record<string, any>) {
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

    async findOneUsingId(id: number) {
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
