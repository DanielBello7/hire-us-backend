import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OptionsService {
    constructor(private readonly database: DatabaseService) {}
    async create(body: CreateOptionDto) {
        return this.database.option.create({
            data: {
                ...body,
                question: {
                    connect: {
                        id: body.question,
                    },
                },
            },
        });
    }

    async createMany(body: CreateOptionDto[]) {
        return this.database.option.createMany({
            data: body.map((option) => ({
                ...option,
                questionId: option.question,
                question: {
                    connect: {
                        id: option.question,
                    },
                },
            })),
        });
    }

    async findAll() {
        return this.database.option.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.option.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find option');
        return response;
    }

    async update(id: number, body: UpdateOptionDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { question, ...rest } = body;
        return this.database.option.update({
            where: {
                id,
            },
            data: {
                ...rest,
            },
        });
    }

    async remove(id: number) {
        return this.database.option.delete({
            where: {
                id,
            },
        });
    }

    async removeMany(filter: Partial<{ questionId: number }>) {
        return this.database.option.deleteMany({
            where: filter,
        });
    }
}
