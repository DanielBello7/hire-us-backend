import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamStatusDto } from './dto/create-exam-status.dto';
import { UpdateExamStatusDto } from './dto/update-exam-status.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExamStatusService {
    constructor(private readonly database: DatabaseService) {}

    async create(body: CreateExamStatusDto) {
        return this.database.examStatus.create({
            data: {
                ...body,
                employee: {
                    connect: {
                        id: body.employee,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.database.examStatus.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.examStatus.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('cannot find status');
        return response;
    }

    async update(id: number, body: UpdateExamStatusDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee, ...rest } = body;
        return this.database.examStatus.update({
            where: {
                id,
            },
            data: {
                ...rest,
            },
        });
    }

    async remove(id: number) {
        return this.database.examStatus.delete({
            where: {
                id,
            },
        });
    }
}
