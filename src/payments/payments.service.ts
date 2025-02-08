import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class PaymentsService {
    constructor(private readonly database: DatabaseService) {}

    /** organization id */
    paySalaries(id: number) {
        console.log(id);
        throw new NotImplementedException('not done');
    }

    async create(body: CreatePaymentDto) {
        return this.database.payment.create({
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

    async createMany(body: CreatePaymentDto[]) {
        return this.database.payment.createMany({
            data: body.map((payment) => ({
                ...payment,
                employeeId: payment.employee,
                organizationId: payment.organization,
            })),
        });
    }

    async findAll(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.payment.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
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

    async update(id: number, body: UpdatePaymentDto) {
        return this.database.payment.update({
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

    async remove(id: number) {
        return this.database.payment.delete({
            where: { id },
        });
    }
}
