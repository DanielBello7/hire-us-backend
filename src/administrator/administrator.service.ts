import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AdministratorService {
    constructor(
        private readonly database: DatabaseService,
        private readonly accounts: AccountsService,
    ) {}

    /** This checks if an admin account with the same email already exists */
    async isEmailRegistered(email: string) {
        const response = await this.database.administrator.findFirst({
            where: {
                email,
            },
        });
        return !!response;
    }

    /** This looks for an admin using the account id*/
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

    /** This creates an admin account */
    async createAdmin(
        body: CreateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isEmailRegistered(body.email)) {
            throw new NotFoundException('email already registered');
        }
        return this.create(body, database);
    }

    /** This updates an admin account */
    async updateAdmin(
        id: number,
        body: UpdateAdministratorDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.name) {
                const admin = await this.findOne(id);
                await this.accounts.updateAccount(
                    admin.accountId,
                    {
                        email: rest.email,
                        name: rest.name,
                    },
                    db,
                );
            }
            return this.update(id, rest, db);
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
