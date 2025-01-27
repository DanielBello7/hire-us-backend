import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { PersonService } from 'src/person/person.service';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';

@Injectable()
export class RegisterService {
    constructor(
        private readonly account: AccountsService,
        private readonly person: PersonService,
    ) {}

    createEmployee(body: CreateRegisterDto) {
        return 'This action adds a new register';
    }

    createAdministrator(body: CreateAccountDto) {
        return 'This action adds a new register';
    }

    createOrganization(body: CreateAccountDto) {
        return 'This action adds a new register';
    }
}
