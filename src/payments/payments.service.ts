import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly employees: EmployeeService,
    ) {}

    /** company id */
    /** this handles payment of employee salary in bulk */
    async paySalaries(
        company: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const employees = await this.employees.get({
            companyid: company,
            isTerminated: false,
        });
        return this.createMany(
            employees.map(
                (employee) => ({
                    amount: employee.position?.salary ?? 0,
                    currency: employee.position?.currency ?? 'usd',
                    employee: employee.id,
                    company: company,
                }),
                database,
            ),
        );
    }

    /** this handles paying of a single employee's salary */
    async payEmployeeSalary(
        employee: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const response = await this.employees.findById(employee);
        return this.create(
            {
                amount: response.position?.salary ?? 0,
                currency: response.position?.currency ?? 'usd',
                employee,
                company: response.companyid,
            },
            database,
        );
    }

    async create(
        body: CreatePaymentDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.payment.create({
            data: {
                ...body,
                company: {
                    connect: {
                        id: body.company,
                    },
                },
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
            },
        });
    }

    async createMany(
        body: CreatePaymentDto[],
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.payment.createMany({
            data: body.map((payment) => ({
                ...payment,
                employeeid: payment.employee,
                companyid: payment.company,
            })),
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
                            'employeeid',
                            'amount',
                            'currency',
                            'companyid',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.payment.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.payment.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException('cannot find payment record');
    }

    async update(
        id: number,
        body: UpdatePaymentDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.payment.update({
            where: {
                id,
            },
            data: {
                ...body,
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
                company: {
                    connect: {
                        id: body.company,
                    },
                },
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.payment.delete({
            where: { id },
        });
    }
}
