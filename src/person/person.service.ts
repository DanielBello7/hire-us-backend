import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PersonService {
    constructor(private readonly database: DatabaseService) {}

    async create(body: CreatePersonDto) {
        const check = await this.database.person.findFirst({
            where: {
                email: body.email,
            },
        });
        if (check) throw new BadRequestException('Email already registered');
        return this.database.person.create({
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
        return this.database.person.findMany();
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

    async update(id: number, body: Omit<UpdatePersonDto, 'account'>) {
        return this.database.person.update({
            where: {
                id,
            },
            data: body,
        });
    }

    async remove(id: number) {
        return this.database.person.delete({
            where: {
                id,
            },
        });
    }
}
