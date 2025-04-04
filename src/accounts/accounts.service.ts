import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
    constructor(private readonly db: DatabaseService) {}

    /** This finds an account using the email but returns null if it
     * cannot find it
     */
    async findByEmailorNull(email: string) {
        return this.db.account.findFirst({
            where: {
                email,
            },
        });
    }

    /** This checks if an email isa lready registered  */
    async isUsed(email: string) {
        const response = await this.db.account.findFirst({
            where: {
                email,
            },
        });
        if (!response) return false;
        return true;
    }

    /** This compares the password of an account with a given string
     * it uses either the id or the email of the account in question
     */
    async comparePassword(idOrEmail: number | string, password: string) {
        const account = await this.db.account.findFirst({
            where:
                typeof idOrEmail === 'string'
                    ? {
                          email: idOrEmail,
                      }
                    : {
                          id: idOrEmail,
                      },
        });
        if (!account) throw new NotFoundException('account not found');
        return bcrypt.compareSync(password, account.password);
    }

    /** This creates an account, it also checks if the account
     * is already registered */
    async save(
        data: CreateAccountDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(data.email)) {
            throw new BadRequestException('Email already registered');
        }
        return this.create(data, database);
    }

    /** this changes the current password but requires the old password for authentication */
    async changePassword(
        id: number,
        oldPassword: string,
        newPassword: string,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (!(await this.comparePassword(id, oldPassword))) {
            throw new BadRequestException('invalid credentials');
        }
        return this.resetPassword(id, newPassword, database);
    }

    /** this changes the current password to a new one without need for the old password for authentication */
    async resetPassword(
        id: number,
        newPassword: string,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const hashed = bcrypt.hashSync(newPassword, 10);
        return this.update(id, { password: hashed }, database);
    }

    async findById(id: number) {
        const account = await this.db.account.findFirst({
            where: {
                id,
            },
            omit: {
                password: true,
            },
        });
        if (account) return account;
        throw new NotFoundException('account not found');
    }

    async get(query: Record<string, any> = {}) {
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
                            'email',
                            'role',
                            'lastLogin',
                            'isEmailVerified',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.account.findMany({
            where: options,
            skip,
            take: pickNum,
            omit: {
                password: true,
            },
        });
    }

    async create(
        data: CreateAccountDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.account.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                password: bcrypt.hashSync(data.password, 10),
            },
        });
    }

    async update(
        id: number,
        updates: UpdateAccountDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        try {
            const db = database ?? this.db;
            return db.account.update({
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
