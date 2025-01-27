import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';
import { PersonService } from 'src/person/person.service';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
    constructor(
        private readonly database: DatabaseService,
        private readonly person: PersonService,
    ) {}

    async checkIfAccountExists(email: string) {
        const response = await this.database.account.findFirst({
            where: {
                email,
            },
        });
        return !response;
    }

    async getAccounts(isEmailVerified?: boolean) {
        if (isEmailVerified) {
            return this.database.account.findMany({
                where: {
                    isEmailVerified,
                },
            });
        } else {
            return this.database.account.findMany();
        }
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

    async createAccount(
        data: CreateAccountDto & Omit<CreatePersonDto, 'account'>,
    ) {
        if (!(await this.checkIfAccountExists(data.email))) {
            throw new BadRequestException('Email already registered');
        }
        return this.database.account.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                password: bcrypt.hashSync(data.password, 10),
            },
        });
    }

    async updateAccount(id: number, updates: UpdateAccountDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, role, lastLogin, ...rest } = updates;
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
        return this.database.account.update({
            where: {
                id,
            },
            data: body,
        });
    }
}
