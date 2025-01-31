import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrganizationService {
    constructor(private readonly database: DatabaseService) {}

    async confirmIfAccountExists(email: string, taxId: string) {
        const response = await this.database.organization.findFirst({
            where: {
                OR: [{ email }, { taxId }],
            },
        });
        return !response;
    }

    async create(body: CreateOrganizationDto) {
        if (!(await this.confirmIfAccountExists(body.email, body.taxId))) {
            throw new BadRequestException('account already registered');
        }
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

    async findAll() {
        return this.database.organization.findMany();
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

    async update(id: number, body: UpdateOrganizationDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taxId, account, address, ...rest } = body;
        return this.database.organization.update({
            where: {
                id,
            },
            data: rest,
        });
    }

    async remove(id: number) {
        return this.database.organization.delete({
            where: { id },
        });
    }
}
