import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class BranchService {
    constructor(
        private readonly db: DatabaseService,
        private readonly employee: EmployeeService,
    ) {}

    /** create branch */
    async createBranch(
        body: CreateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.create(body, database);
    }

    /** update a branch data */
    async updateBranch(
        id: number,
        updates: UpdateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { company: organization, manager, ...rest } = updates;
        return this.update(id, rest, database);
    }

    /** update the manager for a branch */
    async updateManager(
        id: number,
        manager: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        await this.employee.findById(id);
        return this.update(id, { manager }, database);
    }

    /** remove a particular branch using the id */
    async removeBranch(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.remove(id, database);
    }

    /** remove many branches using the organization id */
    async removeManyById(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.branch.deleteMany({
            where: {
                companyid: id,
            },
        });
    }

    /** remove many using ids */
    async removeMany(
        ids: number[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.branch.deleteMany({
            where: {
                id: { in: ids },
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
                            'country',
                            'address',
                            'companyid',
                            'managerid',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.branch.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const selected = await this.db.branch.findFirst({
            where: {
                id,
            },
        });
        if (selected) return selected;
        throw new NotFoundException('unable to find branch');
    }

    async create(
        body: CreateBranchDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.branch.create({
            data: {
                ...body,
                company: {
                    connect: {
                        id: body.company,
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
        const db = database ?? this.db;
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
                company: body.company
                    ? {
                          connect: {
                              id: body.company,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.branch.delete({
            where: {
                id,
            },
        });
    }
}
