import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { DatabaseService } from 'src/database/database.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class BranchService {
    constructor(
        private readonly database: DatabaseService,
        private readonly employee: EmployeeService,
    ) {}

    async createBranch(body: CreateBranchDto) {
        return this.create(body);
    }

    async findAll(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.branch.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
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

    async updateBranch(id: number, updates: UpdateBranchDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, manager, ...rest } = updates;
        return this.update(id, rest);
    }

    async updateManager(id: number, manager: number) {
        await this.employee.findOne(id);
        return this.update(id, { manager });
    }

    async removeBranch(id: number) {
        return this.delete(id);
    }

    async removeManyUsingOrganizationId(organization: number) {
        return this.database.branch.deleteMany({
            where: {
                organizationId: organization,
            },
        });
    }

    async removeMany(ids: number[]) {
        return this.database.branch.deleteMany({
            where: {
                id: { in: ids },
            },
        });
    }

    async create(body: CreateBranchDto) {
        return this.database.branch.create({
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

    async update(id: number, body: UpdateBranchDto) {
        return this.database.branch.update({
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

    async delete(id: number) {
        return this.database.branch.delete({
            where: {
                id,
            },
        });
    }
}
