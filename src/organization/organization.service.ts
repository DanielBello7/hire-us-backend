import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class OrganizationService {
    constructor(private readonly database: DatabaseService) {}

    async isOrganizationRegistered(email: string, taxId: string) {
        const response = await this.database.organization.findFirst({
            where: {
                OR: [{ email }, { taxId }],
            },
        });
        return !response;
    }

    async createOrganization(body: CreateOrganizationDto) {
        if (!(await this.isOrganizationRegistered(body.email, body.taxId))) {
            throw new BadRequestException('account already registered');
        }
        return this.create(body);
    }

    async findAll(query?: ExpressQuery) {
        const { page, pick, ...rest }: any = query;
        const pageNum = Number(page ?? 1);
        const pickNum = Number(pick ?? 5);

        const skip = pickNum * (pageNum - 1);
        return this.database.organization.findMany({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: rest,
            skip,
            take: pickNum,
        });
    }

    async findOne(id: number) {
        const response = await this.database.organization.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('organization not found');
        return response;
    }

    async updateOrganization(id: number, body: UpdateOrganizationDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taxId, account, address, ...rest } = body;
        return this.update(id, rest);
    }

    async remove(id: number) {
        return this.database.organization.delete({
            where: { id },
        });
    }

    async create(body: CreateOrganizationDto) {
        return this.database.organization.create({
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

    async update(id: number, body: UpdateOrganizationDto) {
        return this.database.organization.update({
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
