import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';
import { LoginAccountDto } from './dto/login-account.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import { AdministratorService } from 'src/administrator/administrator.service';
import { PersonService } from 'src/person/person.service';
import { OrganizationService } from 'src/organization/organization.service';

export type ValidatedUser = {
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
        private readonly admin: AdministratorService,
        private readonly person: PersonService,
        private readonly organization: OrganizationService,
    ) {}

    async validate(body: LoginAccountDto): Promise<ValidatedUser | null> {
        const response = await this.accounts.findAccountUsingEmail(body.email);
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
        return this.signIn(response);
    }

    signIn(body: ValidatedUser) {
        const token = this.jwt.sign(body);
        return { token };
    }

    async getMe(id: number) {
        const response = await this.accounts.findAccount(id);
        const actions = {
            [ACCOUNT_ROLES_ENUM.ADMINISTRATOR]: async (id: number) =>
                this.admin.findAdminUsingAccountId(id),
            [ACCOUNT_ROLES_ENUM.EMPLOYEE]: async (id: number) =>
                this.person.findPersonUsingAccountId(id),
            [ACCOUNT_ROLES_ENUM.ORGANIZATIONS]: async (id: number) =>
                this.organization.findOrganizationUsingAccountId(id),
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const action = actions[response.role];
        if (!action) throw new BadRequestException('Invalid account role');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return action(id);
    }
}
