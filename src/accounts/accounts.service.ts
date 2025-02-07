import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PersonService } from 'src/person/person.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
    constructor(
        private readonly database: DatabaseService,
        private readonly person: PersonService,
    ) {}

    async isEmailRegistered(email: string) {
        const response = await this.database.account.findFirst({
            where: {
                email,
            },
        });
        return !response;
    }

    async getAccounts(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.account.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
            skip,
            take: pickNum,
        });
    }

    async findAccount(id: number) {
        const account = await this.database.account.findFirst({
            where: {
                id,
            },
        });
        if (account) return account;
        throw new NotFoundException('account not found');
    }

    async createAccount(data: CreateAccountDto) {
        if (!(await this.isEmailRegistered(data.email))) {
            throw new BadRequestException('Email already registered');
        }
        return this.create(data);
    }

    async updateAccount(id: number, updates: UpdateAccountDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { role, ...rest } = updates;
        const body = rest;
        if (body.email || body.name) {
            await this.person.update(id, {
                email: updates.email,
                name: updates.name,
            });
        }
        if (rest.password) {
            const hashed = bcrypt.hashSync(rest.password, 10);
            body.password = hashed;
        }
        return this.update(id, updates);
    }

    async create(data: CreateAccountDto) {
        return this.database.account.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                password: bcrypt.hashSync(data.password, 10),
            },
        });
    }

    async update(id: number, updates: UpdateAccountDto) {
        try {
            return this.database.account.update({
                where: {
                    id,
                },
                data: updates,
            });
        } catch {
            throw new NotFoundException('error updating account');
        }
    }
}
