import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService } from '@app/common/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaDatabaseService } from '@app/common';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class PersonService {
    constructor(
        private readonly database: DatabaseService,
        private readonly accounts: AccountsService,
    ) {}

    /** This checks if an email is already registered */
    async isEmailRegistered(email: string) {
        const check = await this.database.person.findFirst({
            where: {
                email,
            },
        });
        return !!check;
    }

    /** This looks for a person record using the account id*/
    async findPersonUsingAccountId(id: number) {
        const response = await this.database.person.findFirst({
            where: {
                accountId: id,
            },
        });
        if (!response) throw new NotFoundException('person account not found');
        return response;
    }

    /** This creates a person account */
    async createPerson(
        body: CreatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isEmailRegistered(body.email))
            throw new BadRequestException('Email already registered');
        return this.create(body, database);
    }

    /** This updates a person's account, it also modifies the account record of the
     * person document
     * */
    async updatePerson(
        id: number,
        body: UpdatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.database.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.name) {
                const person = await this.findOne(id);
                await this.accounts.update(
                    person.accountId,
                    {
                        name: rest.name,
                        email: rest.email,
                    },
                    db,
                );
            }
            return this.update(id, rest, db);
        });
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

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.person.delete({
            where: {
                id,
            },
        });
    }

    async create(
        body: CreatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.person.create({
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

    async update(
        id: number,
        body: UpdatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.database;
        return db.person.update({
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
