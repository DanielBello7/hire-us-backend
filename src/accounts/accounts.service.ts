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
        const check = await this.database.account.findFirst({
            where: {
                email: data.email,
            },
        });
        if (check) throw new BadRequestException('Email already registered');
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
        if (updates.email || updates.name) {
            await this.person.update(id, {
                name: updates.name,
                email: updates.email,
            });
        }
        return this.database.account.update({
            where: {
                id,
            },
            data: updates,
        });
    }
}
