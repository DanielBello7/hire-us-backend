import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class PromotionsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly employee: EmployeeService,
    ) {}

    /** handles the promotion of an employee */
    async promote(employee: number) {
        const selected = await this.employee.findById(employee);
        if (!selected.positionid) {
            throw new BadRequestException(
                'Employee cannot be promoted. No position currently held',
            );
        }
        if (!selected.position?.successorid) {
            throw new BadRequestException(
                'Employee cannot be promoted. Position has no successor',
            );
        }
        return this.employee.modify(employee, {
            person: selected.position.successorid,
        });
    }

    async create(
        body: CreatePromotionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.promotion.create({
            data: {
                ...body,
                fromPosition: {
                    connect: {
                        id: body.fromPosition,
                    },
                },
                toPosition: {
                    connect: {
                        id: body.toPosition,
                    },
                },
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
                exam: body.exam
                    ? {
                          connect: {
                              id: body.exam,
                          },
                      }
                    : undefined,
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
                            'type',
                            'examid',
                            'employeeid',
                            'fromPositionid',
                            'toPositionid',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.promotion.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.promotion.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException('cannot find promotion');
    }

    async update(
        id: number,
        body: UpdatePromotionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.promotion.update({
            where: {
                id,
            },
            data: {
                ...body,
                exam: body.exam ? { connect: { id: body.exam } } : undefined,
                employee: body.employee
                    ? { connect: { id: body.employee } }
                    : undefined,
                fromPosition: body.fromPosition
                    ? { connect: { id: body.fromPosition } }
                    : undefined,
                toPosition: body.toPosition
                    ? { connect: { id: body.toPosition } }
                    : undefined,
            },
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.promotion.delete({
            where: {
                id,
            },
        });
    }
}
