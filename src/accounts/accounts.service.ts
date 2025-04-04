import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PersonService } from 'src/person/person.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import * as bcrypt from 'bcrypt';
import { AdminsService } from 'src/admins/admins.service';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class AccountsService {
    constructor(
        private readonly person: PersonService,
        private readonly admin: AdminsService,
        private readonly db: DatabaseService,
        private readonly organization: CompanyService,
    ) {}

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
        const isPositive = bcrypt.compareSync(password, account.password);
        return !!isPositive;
    }

    /** This creates an account, it also checks if the account
     * is already registered */
    async createAccount(
        data: CreateAccountDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(data.email)) {
            throw new BadRequestException('Email already registered');
        }
        return this.create(data, database);
    }

    /** This updates an account's data but removes some certain
     * fields, then it also updates the
     * same field for the respective account role types
     */
    async modify(
        id: number,
        updates: UpdateAccountDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const { role, ...rest } = updates;

        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.name || rest.avatar) {
                if (role === ACCOUNT_ROLES_ENUM.COMPANY) {
                    await this.organization.modify(
                        id,
                        {
                            title: updates.name,
                            email: updates.email,
                            avatar: rest.avatar,
                        },
                        db,
                    );
                }
                if (role === ACCOUNT_ROLES_ENUM.EMPLOYEE) {
                    await this.person.modify(
                        id,
                        {
                            name: updates.name,
                            email: updates.email,
                            avatar: rest.avatar,
                        },
                        db,
                    );
                }
                if (role === ACCOUNT_ROLES_ENUM.ADMIN) {
                    await this.admin.modify(
                        id,
                        {
                            name: updates.name,
                            email: updates.email,
                        },
                        db,
                    );
                }
            }

            if (rest.password) {
                const hashed = bcrypt.hashSync(rest.password, 10);
                rest.password = hashed;
            }

            return this.update(id, updates, db);
        });
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
