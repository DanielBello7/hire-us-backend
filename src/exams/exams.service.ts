/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExamsService {
    constructor(private readonly database: DatabaseService) {}

    async create(body: CreateExamDto) {
        return this.database.exam.create({
            data: {
                ...body,
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
                eligiblePositions: body.eligiblePositions
                    ? {
                          connect: body.eligiblePositions?.map((item) => ({
                              id: item,
                          })),
                      }
                    : undefined,
                ineligibleEmployees: body.ineligibleEmployees
                    ? {
                          connect: body.ineligibleEmployees?.map((item) => ({
                              id: item,
                          })),
                      }
                    : undefined,
            },
        });
    }

    async findAll() {
        return this.database.exam.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.exam.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find exam');
        return response;
    }

    async update(id: number, body: UpdateExamDto) {
        const {
            organization,
            eligiblePositions,
            ineligibleEmployees,
            ...rest
        } = body;
        return this.database.exam.update({
            where: {
                id,
            },
            data: rest,
        });
    }

    async updateEligiblePositions(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
    ) {
        return this.database.exam.update({
            where: {
                id,
            },
            data: {
                eligiblePositions: {
                    connect: addPositions.map((id) => ({ id })),
                    disconnect: removePositions.map((id) => ({ id })),
                },
            },
        });
    }

    async updateIneligibleEmployees(
        id: number,
        addPositions: number[] = [],
        removePositions: number[] = [],
    ) {
        return this.database.exam.update({
            where: {
                id,
            },
            data: {
                ineligibleEmployees: {
                    connect: addPositions.map((id) => ({ id })),
                    disconnect: removePositions.map((id) => ({ id })),
                },
            },
        });
    }

    async remove(id: number) {
        await this.database.exam.delete({
            where: {
                id,
            },
        });
    }
}
