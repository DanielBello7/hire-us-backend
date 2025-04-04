import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class PersonService {
    constructor(
        private readonly accounts: AccountsService,
        private readonly db: DatabaseService,
    ) {}

    /** This checks if an email is already registered */
    async isUsed(email: string) {
        const check = await this.db.person.findFirst({
            where: {
                email,
            },
        });
        if (check) return true;
        return false;
    }

    /** This looks for a person record using the account id*/
    async findByAccId(id: number) {
        const response = await this.db.person.findFirst({
            where: {
                accountid: id,
            },
        });
        if (response) return response;
        throw new NotFoundException();
    }

    /** This creates a person account */
    async createPerson(
        body: CreatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(body.email)) {
            throw new BadRequestException('Email already registered');
        }
        return this.create(body, database);
    }

    /** This updates a person's account, it also modifies the account record of the
     * person document
     * */
    async modify(
        id: number,
        body: UpdatePersonDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.name) {
                const person = await this.findById(id);
                await this.accounts.update(
                    person.accountid,
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
                            'taxid',
                            'accountid',
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

        return this.db.person.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.person.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException();
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
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
        else db = this.db;
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
        else db = this.db;
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
