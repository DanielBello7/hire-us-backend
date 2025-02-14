import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';
import { TerminatedService } from 'src/terminated/terminated.service';

@Injectable()
export class EmployeeService {
    constructor(
        private readonly database: DatabaseService,
        private readonly terminated: TerminatedService,
    ) {}

    async isEmployeeRegistered(personId: number, organizationId: number) {
        const response = await this.database.employee.findFirst({
            where: {
                personId,
                organizationId,
            },
        });
        return !!response;
    }

    async createEmployee(
        body: CreateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const isRegistered = await this.isEmployeeRegistered(
            body.person,
            body.organization,
        );
        if (isRegistered) {
            throw new BadRequestException('Employee already exists');
        } else {
            return this.create(body, database);
        }
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
                            'personId',
                            'organizationId',
                            'positionId',
                            'isTerminated',
                            'examId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.employee.findMany({
            where: options,
            skip,
            take: pickNum,
            include: {
                person: true,
                position: true,
            },
        });
    }

    async findOne(id: number) {
        const response = await this.database.employee.findFirst({
            where: {
                id,
            },
            include: {
                person: true,
                position: true,
            },
        });
        if (!response) throw new NotFoundException('employee not found');
        return response;
    }

    async updateEmployee(
        id: number,
        body: UpdateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, person, ...rest } = body;
        return this.update(id, rest, database);
    }

    async layoffEmployee(
        id: number,
        reason: string,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.database.$transaction(async (tx) => {
            const employee = await this.findOne(id);
            await this.terminated.create(
                {
                    employee: id,
                    organization: employee.organizationId,
                    reason,
                },
                tx,
            );
            return this.update(id, { isTerminated: true }, database ?? tx);
        });
    }

    async delete(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.employee.delete({
            where: {
                id,
            },
            include: {
                person: true,
                position: true,
            },
        });
    }

    async create(
        body: CreateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.employee.create({
            data: {
                ...body,
                person: {
                    connect: {
                        id: body.person,
                    },
                },
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
                position: {
                    connect: {
                        id: body.position,
                    },
                },
            },
            include: {
                person: true,
                position: true,
            },
        });
    }

    async update(
        id: number,
        body: UpdateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.employee.update({
            where: { id },
            data: {
                ...body,
                position: body.position
                    ? {
                          connect: {
                              id: body.position,
                          },
                      }
                    : undefined,
                person: body.person
                    ? {
                          connect: {
                              id: body.person,
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
            include: {
                person: true,
                position: true,
            },
        });
    }
}
