import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';

@Injectable()
export class PaymentsService {
    constructor(private readonly database: DatabaseService) {}

    /** organization id */
    paySalaries(id: number) {
        console.log(id);
        throw new NotImplementedException('not done');
    }

    async create(
        body: CreatePaymentDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.payment.create({
            data: {
                ...body,
                organization: {
                    connect: {
                        id: body.organization,
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
        const db = database ?? this.database;
        return db.payment.createMany({
            data: body.map((payment) => ({
                ...payment,
                employeeId: payment.employee,
                organizationId: payment.organization,
            })),
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
                            'employeeid',
                            'amount',
                            'currency',
                            'organizationId',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.payment.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.payment.findFirst({
            where: {
                id,
            },
        });
        if (!response)
            throw new NotFoundException('cannot find payment record');
        return response;
    }

    async update(
        id: number,
        body: UpdatePaymentDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
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
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.database;
        return db.payment.delete({
            where: { id },
        });
    }
}
