import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class AdministratorService {
    constructor(private readonly database: DatabaseService) {}

    async isEmailRegistered(email: string) {
        const response = await this.database.administrator.findFirst({
            where: {
                email,
            },
        });
        return !!response;
    }

    async findAdminUsingAccountId(id: number) {
        const response = await this.database.administrator.findFirst({
            where: {
                accountId: id,
            },
        });
        if (!response)
            throw new NotFoundException('administrator account not found');
        return response;
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
                            'name',
                            'accountId',
                            'email',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.administrator.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.administrator.findFirst({
            where: {
                id,
            },
        });
        if (!response)
            throw new NotFoundException('administrator account not found');
        return response;
    }

    async createAdmin(
        body: CreateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isEmailRegistered(body.email)) {
            throw new NotFoundException('email already registered');
        }
        return this.create(body, database);
    }

    async updateAdmin(
        id: number,
        body: UpdateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(
        body: CreateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.administrator.create({
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

    async update(
        id: number,
        body: UpdateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.administrator.update({
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
}
