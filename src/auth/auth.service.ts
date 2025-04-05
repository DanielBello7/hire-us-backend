import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import { LoginAccountDto } from './dto/login-account.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admins/admins.service';
import { PersonService } from 'src/person/person.service';
import { CompanyService } from 'src/company/company.service';
import { Person } from 'src/person/entities/person.entity';
import { Admin } from 'src/admins/entities/admins.entity';
import { Company } from 'src/company/entities/company.entity';

export type ValidUser = {
    role: ACCOUNT_ROLES_ENUM;
    email: string;
    accountId: number;
    name: string;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly accounts: AccountsService,
        private readonly jwt: JwtService,
        private readonly admin: AdminsService,
        private readonly person: PersonService,
        private readonly company: CompanyService,
    ) {}

    async validate(body: LoginAccountDto): Promise<ValidUser | null> {
        const response = await this.accounts.findByEmailorNull(body.email);
        if (!response) return null;
        if (
            !(await this.accounts.comparePassword(
                response.email,
                body.password,
            ))
        )
            return null;
        return {
            role: response.role as ACCOUNT_ROLES_ENUM,
            accountId: response.id,
            name: response.name,
            email: response.email,
        };
    }

    async authenticate(body: LoginAccountDto) {
        const response = await this.validate(body);
        if (!response) throw new UnauthorizedException();
        return this.sign_in(response);
    }

    sign_in(body: ValidUser) {
        const token = this.jwt.sign(body);
        return { token };
    }

    async getMe(id: number) {
        const response = await this.accounts.findById(id);
        const actions: Record<
            string,
            (id: number) => Promise<Person | Admin | Company>
        > = {
            [ACCOUNT_ROLES_ENUM.EMPLOYEE]: async (id: number) => {
                return this.person.findByAccId(id);
            },
            [ACCOUNT_ROLES_ENUM.ADMIN]: async (id: number) => {
                return this.admin.findByAccId(id);
            },
            [ACCOUNT_ROLES_ENUM.COMPANY]: async (id: number) => {
                return this.company.findByAccId(id);
            },
        };
        const action = actions[response.role];
        if (action) return action(id);
        throw new BadRequestException('invalid role');
    }
}
