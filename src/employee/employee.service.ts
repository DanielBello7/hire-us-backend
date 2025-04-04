import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { TerminatedService } from 'src/terminated/terminated.service';

@Injectable()
export class EmployeeService {
    constructor(
        private readonly db: DatabaseService,
        private readonly terminated: TerminatedService,
    ) {}

    /** This checks if an employee is registered */
    async isUsed(personid: number, companyid: number) {
        const response = await this.db.employee.findFirst({
            where: {
                personid,
                companyid,
            },
        });
        if (response) return true;
        return false;
    }

    /** this creates a new employee record */
    async createEmployee(
        body: CreateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(body.person, body.company)) {
            throw new BadRequestException('Employee already exists');
        }
        return this.create(body, database);
    }

    /**
     * This updates an employee record,
     * It excludes some fields
     */
    async modify(
        id: number,
        body: UpdateEmployeeDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { company: organization, person, ...rest } = body;
        return this.update(id, rest, database);
    }

    /** This completes the layoff function for an employee ,
     * It sets the terminated value to true,
     * This also creates a terminated record for the employee
     */
    async layoff(
        id: number,
        reason: string,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        return this.db.$transaction(async (tx) => {
            const employee = await this.findById(id);
            await this.terminated.create(
                {
                    employee: id,
                    company: employee.companyid,
                    reason,
                },
                tx,
            );
            return this.update(id, { terminated: true }, database ?? tx);
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

        return this.db.employee.findMany({
            where: options,
            skip,
            take: pickNum,
            include: {
                person: true,
                position: true,
            },
        });
    }

    async findById(id: number) {
        const response = await this.db.employee.findFirst({
            where: {
                id,
            },
            include: {
                person: true,
                position: true,
            },
        });
        if (response) return response;
        throw new NotFoundException('employee not found');
    }

    async delete(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
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
        const db = database ?? this.db;
        return db.employee.create({
            data: {
                ...body,
                person: {
                    connect: {
                        id: body.person,
                    },
                },
                company: {
                    connect: {
                        id: body.company,
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
        const db = database ?? this.db;
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
                company: body.company
                    ? {
                          connect: {
                              id: body.company,
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
