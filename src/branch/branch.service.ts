import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { DatabaseService } from 'src/database/database.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class BranchService {
    constructor(
        private readonly database: DatabaseService,
        private readonly employee: EmployeeService,
    ) {}

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

    async findAll(organization?: number) {
        if (organization) {
            return this.database.branch.findMany({
                where: {
                    organizationId: organization,
                },
            });
        }
        return this.database.branch.findMany();
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

    async update(id: number, updates: UpdateBranchDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, ...rest } = updates;
        return this.database.branch.update({
            where: {
                id,
            },
            data: {
                ...rest,
                manager: {},
            },
        });
    }

    async updateManager(id: number, manager: number) {
        await this.employee.findOne(id);
        return this.database.branch.update({
            where: {
                id,
            },
            data: {
                manager: {
                    connect: {
                        id: manager,
                    },
                },
            },
        });
    }

    async remove(id: number) {
        return this.database.branch.delete({
            where: {
                id,
            },
        });
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
}
