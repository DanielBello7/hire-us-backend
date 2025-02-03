import {
    Injectable,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PromotionsService {
    constructor(private readonly database: DatabaseService) {}

    promote() {
        throw new NotImplementedException('not yet done');
    }

    employeePromotion(id: number) {
        console.log(id);
        throw new NotImplementedException('not done yet');
    }

    async create(body: CreatePromotionDto) {
        return this.database.promotion.create({
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

    async findAll() {
        return this.database.promotion.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.promotion.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find promotion');
        return response;
    }

    async update(id: number, body: UpdatePromotionDto) {
        return this.database.promotion.update({
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

    async remove(id: number) {
        return this.database.promotion.delete({
            where: {
                id,
            },
        });
    }
}
