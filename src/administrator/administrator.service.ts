import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class AdministratorService {
    constructor(private readonly database: DatabaseService) {}

    async isEmailRegistered(email: string) {
        const response = await this.database.administrator.findFirst({
            where: {
                email,
            },
        });
        return !response;
    }

    async findAll(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.administrator.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.administrator.findFirst({
            where: {
                id,
            },
        });
        if (!response)
            throw new NotFoundException('administrator account not found');
        return response;
    }

    async createAdmin(body: CreateAdministratorDto) {
        if (!(await this.isEmailRegistered(body.email))) {
            throw new NotFoundException('email already registered');
        }
        return this.create(body);
    }

    async updateAdmin(id: number, body: UpdateAdministratorDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.update(id, rest);
    }

    async create(body: CreateAdministratorDto) {
        return this.database.administrator.create({
            data: {
                ...body,
                account: {
                    connect: {
                        id: body.account,
                    },
                },
            },
        });
    }

    async update(id: number, body: UpdateAdministratorDto) {
        return this.database.administrator.update({
            where: {
                id,
            },
            data: {
                ...body,
                account: body.account
                    ? {
                          connect: {
                              id: body.account,
                          },
                      }
                    : undefined,
            },
        });
    }
}
