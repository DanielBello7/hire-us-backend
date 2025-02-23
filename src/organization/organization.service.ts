import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class OrganizationService {
    constructor(
        private readonly database: DatabaseService,
        private readonly accounts: AccountsService,
    ) {}

    /** This checks if an organization is registered, using the email and tax id */
    async isOrganizationRegistered(email: string, taxId: string) {
        const response = await this.database.organization.findFirst({
            where: {
                OR: [{ email }, { taxId }],
            },
        });
        return !!response;
    }

    /** This looks for an organization using the account id*/
    async findOrganizationUsingAccountId(id: number) {
        const response = await this.database.organization.findFirst({
            where: {
                accountId: id,
            },
        });
        if (!response)
            throw new NotFoundException('organization account not found');
        return response;
    }

    /** This creates an organization */
    async createOrganization(
        body: CreateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isOrganizationRegistered(body.email, body.taxId)) {
            throw new BadRequestException('account already registered');
        }
        return this.create(body, database);
    }

    /** This updates an organization account, it also updates the accound
     * record of the organization
     */
    async updateOrganization(
        id: number,
        body: UpdateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taxId, account, address, ...rest } = body;
        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.title) {
                const organization = await this.findOne(id);
                await this.accounts.update(
                    organization.accountId,
                    {
                        email: rest.email,
                        name: rest.title,
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
                            'accountId',
                            'title',
                            'email',
                            'country',
                            'address',
                            'avatar',
                            'brief',
                            'taxId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.organization.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.organization.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('organization not found');
        return response;
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.organization.delete({
            where: { id },
        });
    }

    async create(
        body: CreateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.organization.create({
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
        body: UpdateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.organization.update({
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
