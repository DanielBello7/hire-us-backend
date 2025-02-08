import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class PersonService {
    constructor(private readonly database: DatabaseService) {}

    async isEmailRegistered(email: string) {
        const check = await this.database.person.findFirst({
            where: {
                email,
            },
        });
        return !!check;
    }

    async createPerson(body: CreatePersonDto) {
        if (await this.isEmailRegistered(body.email))
            throw new BadRequestException('Email already registered');
        return this.create(body);
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
                            'name',
                            'taxId',
                            'accountId',
                            'email',
                            'username',
                            'country',
                            'address',
                            'gender',
                            'avatar',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.database.person.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const check = await this.database.person.findFirst({
            where: {
                id,
            },
        });
        if (!check) throw new NotFoundException('Unable to find person');
        return check;
    }

    async updatePerson(id: number, body: UpdatePersonDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.update(id, rest);
    }

    async remove(id: number) {
        return this.database.person.delete({
            where: {
                id,
            },
        });
    }

    async create(body: CreatePersonDto) {
        return this.database.person.create({
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

    async update(id: number, body: UpdatePersonDto) {
        return this.database.person.update({
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
