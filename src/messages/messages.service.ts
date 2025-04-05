import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class MessagesService {
    constructor(
        private readonly db: DatabaseService,
        private readonly uploads: UploadsService,
    ) {}

    /** find the messages for a particular conversation */
    async findConversationMessages(conversation: number) {
        return this.db.message.findMany({
            where: {
                conversationid: conversation,
            },
            include: {
                createdBy: true,
            },
        });
    }

    /** save a message with a media upload or none */
    async save(
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
        const db = database ?? this.db;
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
                            'body',
                            'media',
                            'mediaType',
                            'createdByid',
                            'conversationid',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.message.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.message.findFirst({
            where: {
                id,
            },
            include: {
                createdBy: true,
            },
        });
        if (response) return response;
        throw new NotFoundException('cannot find message');
    }

    async update(
        id: number,
        body: UpdateMessageDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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
        const db = database ?? this.db;
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
        const db = database ?? this.db;
        return db.message.deleteMany({
            where: {
                conversationid: conversation,
            },
        });
    }
}
