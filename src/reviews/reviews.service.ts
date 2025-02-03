import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly database: DatabaseService) {}
    async create(body: CreateReviewDto) {
        return this.database.review.create({
            data: {
                ...body,
                createdFor: {
                    connect: {
                        id: body.createdFor,
                    },
                },
                createdBy: {
                    connect: {
                        id: body.createdBy,
                    },
                },
            },
            include: {
                createdBy: true,
                createdFor: true,
            },
        });
    }

    async findAll() {
        return this.database.review.findMany({
            include: {
                createdBy: true,
                createdFor: true,
            },
        });
    }

    async findOne(id: number) {
        const response = await this.database.review.findFirst({
            where: {
                id,
            },
            include: {
                createdBy: true,
                createdFor: true,
            },
        });
        if (!response) throw new NotFoundException('cannot find review');
        return response;
    }

    async update(id: number, body: UpdateReviewDto) {
        return this.database.review.update({
            where: {
                id,
            },
            data: {
                ...body,
                createdFor: body.createdFor
                    ? {
                          connect: {
                              id: body.createdFor,
                          },
                      }
                    : undefined,
                createdBy: body.createdBy
                    ? {
                          connect: {
                              id: body.createdBy,
                          },
                      }
                    : undefined,
            },
            include: {
                createdBy: true,
                createdFor: true,
            },
        });
    }

    async remove(id: number) {
        return this.database.review.delete({
            where: { id },
        });
    }
}
