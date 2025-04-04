import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admins.dto';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AdminsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly accounts: AccountsService,
    ) {}

    /** This checks if an admin account with the same email already exists */
    async isUsed(email: string) {
        const response = await this.db.admin.findFirst({
            where: {
                email,
            },
        });
        if (!response) return false;
        return true;
    }

    /** This looks for an admin using the account id*/
    async findByAccId(id: number) {
        const response = await this.db.admin.findFirst({
            where: {
                accountid: id,
            },
        });
        if (response) return response;
        throw new NotFoundException('admin account not found');
    }

    /** This creates an admin account */
    async save(
        body: CreateAdminDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(body.email)) {
            throw new NotFoundException('email already registered');
        }
        return this.create(body, database);
    }

    /** This updates an admin account */
    async modify(
        id: number,
        body: UpdateAdminDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.name) {
                const admin = await this.findById(id);
                await this.accounts.update(
                    admin.accountid,
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

        return this.db.admin.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.admin.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException('admin not found');
    }

    async create(
        body: CreateAdminDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.admin.create({
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
        body: UpdateAdminDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.admin.update({
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
