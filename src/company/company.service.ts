import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class CompanyService {
    constructor(
        private readonly db: DatabaseService,
        private readonly accounts: AccountsService,
    ) {}

    /** This checks if an organization is registered, using the email and tax id */
    async isUsed(email: string, taxid: string) {
        const response = await this.db.company.findFirst({
            where: {
                OR: [{ email }, { taxid }],
            },
        });
        if (!response) return false;
        return true;
    }

    /** This looks for an organization using the account id*/
    async findByAccId(id: number) {
        const response = await this.db.company.findFirst({
            where: {
                accountid: id,
            },
        });
        if (response) return response;
        throw new NotFoundException('company account not found');
    }

    /** This creates an organization */
    async createCompany(
        body: CreateCompanyDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.isUsed(body.email, body.taxid)) {
            throw new BadRequestException('account already registered');
        }
        return this.create(body, database);
    }

    /** This updates an organization account, it also updates the accound
     * record of the organization
     */
    async modify(
        id: number,
        body: UpdateCompanyDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taxid: taxId, account, address, ...rest } = body;
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            if (rest.email || rest.title) {
                const company = await this.findById(id);
                await this.accounts.update(
                    company.accountid,
                    {
                        email: rest.email,
                        name: rest.title,
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
                            'accountid',
                            'title',
                            'email',
                            'country',
                            'address',
                            'avatar',
                            'brief',
                            'taxid',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.company.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.company.findFirst({
            where: {
                id,
            },
        });
        if (response) return response;
        throw new NotFoundException('company not found');
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.company.delete({
            where: { id },
        });
    }

    async create(
        body: CreateCompanyDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.company.create({
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
        body: UpdateCompanyDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const db = database ?? this.db;
        return db.company.update({
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
