import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { OrganizationService } from 'src/organization/organization.service';
import { PersonService } from 'src/person/person.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class UploadsService {
    private readonly folder = path.join(__dirname, '..', '..', 'public');

    constructor(
        private readonly database: DatabaseService,
        private readonly organization: OrganizationService,
        private readonly person: PersonService,
        private readonly accounts: AccountsService,
    ) {}

    /** get the size of the public folder */
    getFolderSizeSync(folderPath: string): number {
        let totalSize = 0;
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                totalSize += this.getFolderSizeSync(filePath);
            }
        }
        return totalSize;
    }

    /** check if the public folder holding files has reached it's max capacity */
    isFolderMaxed() {
        const size = this.getFolderSizeSync(this.folder);
        /** 1024bytes = 1KB, 104,857,600bytes = 100MB */
        if (size > 104857600) return true;
        return false;
    }

    /** add a file to the public folder */
    async saveFile(
        username: number,
        file: Express.Multer.File,
        database?: PrismaDatabaseService,
    ) {
        if (!fs.existsSync(this.folder)) fs.mkdirSync(this.folder);
        const location = path.join(this.folder, file.originalname);
        fs.writeFileSync(location, file.buffer);
        const tempid = uuid();
        return this.create(
            {
                account: username,
                mimetype: file.mimetype,
                size: file.size,
                title: file.originalname,
                url: `/api/uploads/${tempid}`,
                tempid,
            },
            database,
        );
    }

    /** update the avatar of an account */
    async updateAvatar(
        accountid: number,
        files: Express.Multer.File[],
        database?: PrismaDatabaseService,
    ) {
        if (this.isFolderMaxed())
            throw new InternalServerErrorException('storage maxed out');
        return this.database.$transaction(async (tx) => {
            const upload = await this.saveFile(
                accountid,
                files[0],
                database ?? tx,
            );

            await this.accounts.updateAccount(
                accountid,
                {
                    avatar: upload.url,
                },
                database ?? tx,
            );

            return upload;
        });
    }

    /** find upload and return the document with the response */
    async findUpload(id: string, res: Response) {
        try {
            const selected = await this.findUsingTempId(id);
            const location = path.join(this.folder, selected.title);
            if (!fs.existsSync(location))
                throw new NotFoundException('file missing on disk');
            return res
                .setHeader('Content-Type', selected.mimetype)
                .send(fs.readFileSync(location));
        } catch {
            throw new BadRequestException(
                'error occured while retrieving file',
            );
        }
    }

    /** find file using temp id */
    async findUsingTempId(id: string) {
        const response = await this.database.upload.findFirst({
            where: { tempid: id },
            include: { account: true },
        });
        if (!response) throw new NotFoundException('upload record not found');
        return response;
    }

    /** delete uploaded file */
    async deleteUpload(id: number) {
        try {
            const selected = await this.findOne(id);
            const location = path.join(this.folder, selected.title);
            if (!fs.existsSync(location))
                throw new NotFoundException('file missing on disk');
            await this.remove(id);
            return fs.unlinkSync(location);
        } catch {
            throw new BadRequestException('error occured while deleting file');
        }
    }

    async create(body: CreateUploadDto, database?: PrismaDatabaseService) {
        const db = database ?? this.database;
        return db.upload.create({
            data: {
                ...body,
                account: {
                    connect: {
                        id: body.account,
                    },
                },
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
                            'accountId',
                            'url',
                            'title',
                            'size',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.upload.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.upload.findFirst({
            where: { id },
            include: { account: true },
        });
        if (!response) throw new NotFoundException('upload record not found');
        return response;
    }

    async update(
        id: number,
        body: UpdateUploadDto,
        database?: PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.upload.update({
            where: {
                id,
            },
            data: {
                ...body,
                account: body.account
                    ? {
                          connect: {
                              id: body.account,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(id: number, database?: PrismaDatabaseService) {
        const db = database ?? this.database;
        return db.upload.delete({
            where: {
                id,
            },
        });
    }
}
