import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdministratorService {
    constructor(private readonly database: DatabaseService) {}

    async checkIfAdminExists(email: string) {
        const response = await this.database.administrator.findFirst({
            where: {
                email,
            },
        });
        return !response;
    }

    async create(body: CreateAdministratorDto) {
        if (!(await this.checkIfAdminExists(body.email))) {
            throw new NotFoundException('email already registered');
        }
        return this.database.administrator.create({
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

    async findAll() {
        return this.database.administrator.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.administrator.findFirst({
            where: {
                id,
            },
        });
        if (!response)
            throw new NotFoundException('administrator account not found');
        return response;
    }

    async update(id: number, body: UpdateAdministratorDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { account, ...rest } = body;
        return this.database.administrator.update({
            where: {
                id,
            },
            data: {
                ...rest,
            },
        });
    }
}
