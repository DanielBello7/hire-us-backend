import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeeService {
    constructor(private readonly database: DatabaseService) {}

    async checkIfEmployeeExists(personId: number, organizationId: number) {
        const response = await this.database.employee.findFirst({
            where: {
                personId,
                organizationId,
            },
        });
        return !response;
    }

    async create(body: CreateEmployeeDto) {
        if (
            !(await this.checkIfEmployeeExists(body.person, body.organization))
        ) {
            throw new BadRequestException('Employee already exists');
        }
        return this.database.employee.create({
            data: {
                ...body,
                person: {
                    connect: { id: body.person },
                },
                organization: {
                    connect: { id: body.organization },
                },
                position: {
                    connect: { id: body.position },
                },
            },
        });
    }

    async findAll() {
        return this.database.employee.findMany();
    }

    async findOne(id: number) {
        const response = await this.database.employee.findFirst({
            where: {
                id,
            },
        });
        if (!response) throw new NotFoundException('employee not found');
        return response;
    }

    async update(id: number, body: UpdateEmployeeDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organization, person, ...rest } = body;
        return this.database.employee.update({
            where: { id },
            data: {
                ...rest,
                position: {
                    connect: {
                        id: rest.position,
                    },
                },
            },
        });
    }
}
