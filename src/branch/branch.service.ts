import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { DatabaseService } from 'src/database/database.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from 'src/common/config/prisma-database-type.confg';

@Injectable()
export class BranchService {
    constructor(
        private readonly database: DatabaseService,
        private readonly employee: EmployeeService,
    ) {}

    async createBranch(
        body: CreateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
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
                            'country',
                            'address',
                            'organizationId',
                            'managerId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.branch.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const selected = await this.database.branch.findFirst({
            where: {
                id,
            },
        });
        if (!selected) throw new NotFoundException('unable to find branch');
        return selected;
    }

    async updateBranch(
        id: number,
        updates: UpdateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, manager, ...rest } = updates;
        return this.update(id, rest, database);
    }

    async updateManager(
        id: number,
        manager: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        await this.employee.findOne(id);
        return this.update(id, { manager }, database);
    }

    async removeBranch(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.delete(id, database);
    }

    async removeManyUsingOrganizationId(
        organization: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.branch.deleteMany({
            where: {
                organizationId: organization,
            },
        });
    }

    async removeMany(
        ids: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.branch.deleteMany({
            where: {
                id: { in: ids },
            },
        });
    }

    async create(
        body: CreateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.branch.create({
            data: {
                ...body,
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
                manager: !body.manager
                    ? undefined
                    : {
                          connect: {
                              id: body.manager,
                          },
                      },
            },
        });
    }

    async update(
        id: number,
        body: UpdateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.branch.update({
            where: {
                id,
            },
            data: {
                ...body,
                manager: body.manager
                    ? {
                          connect: {
                              id: body.manager,
                          },
                      }
                    : undefined,
                organization: body.organization
                    ? {
                          connect: {
                              id: body.organization,
                          },
                      }
                    : undefined,
            },
        });
    }

    async delete(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.branch.delete({
            where: {
                id,
            },
        });
    }
}
