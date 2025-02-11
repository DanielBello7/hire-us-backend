import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from 'src/common/config/prisma-database-type.confg';

@Injectable()
export class OrganizationService {
    constructor(private readonly database: DatabaseService) {}

    async isOrganizationRegistered(email: string, taxId: string) {
        const response = await this.database.organization.findFirst({
            where: {
                OR: [{ email }, { taxId }],
            },
        });
        return !!response;
    }

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

    async createOrganization(
        body: CreateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isOrganizationRegistered(body.email, body.taxId)) {
            throw new BadRequestException('account already registered');
        }
        return this.create(body, database);
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

    async updateOrganization(
        id: number,
        body: UpdateOrganizationDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taxId, account, address, ...rest } = body;
        return this.update(id, rest, database);
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
