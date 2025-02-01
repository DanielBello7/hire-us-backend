import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PositionsService {
    constructor(private readonly database: DatabaseService) {}

    async create(body: CreatePositionDto) {
        return this.database.position.create({
            data: {
                ...body,
                fromPosition: body.fromPosition
                    ? {
                          connect: {
                              id: body.fromPosition,
                          },
                      }
                    : undefined,
                toPosition: body.toPosition
                    ? {
                          connect: {
                              id: body.toPosition,
                          },
                      }
                    : undefined,
                organization: {
                    connect: {
                        id: body.organization,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.database.position.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.position.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find position');
        return response;
    }

    async update(id: number, body: UpdatePositionDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, ...rest } = body;
        return this.database.position.update({
            where: {
                id,
            },
            data: {
                ...rest,
                fromPosition: rest.fromPosition
                    ? {
                          connect: {
                              id: rest.fromPosition,
                          },
                      }
                    : undefined,
                toPosition: rest.toPosition
                    ? {
                          connect: {
                              id: rest.toPosition,
                          },
                      }
                    : undefined,
            },
        });
    }

    async remove(id: number) {
        return this.database.position.delete({
            where: { id },
        });
    }
}
