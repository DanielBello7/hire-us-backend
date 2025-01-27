import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
    private accounts = [
        {
            _id: '1',
            email: 'adam@example.com',
            password: 'adam1',
            isEmailVerified: false,
        },
        {
            _id: '2',
            email: 'eve@example.com',
            password: 'eve2',
            isEmailVerified: true,
        },
    ];

    getAccounts(isEmailVerified?: boolean) {
        if (isEmailVerified) {
            return this.accounts.filter(
                (account) => account.isEmailVerified === isEmailVerified,
            );
        } else {
            return this.accounts;
        }
    }

    findAccount(id: string) {
        const selected = this.accounts.find((account) => account._id === id);
        if (selected) return selected;
        throw new NotFoundException('account not found');
    }

    createAccount(account: CreateAccountDto) {
        const created = {
            _id: String(Math.random() * 10),
            email: account.email,
            isEmailVerified: false,
            password: 'password',
        };
        this.accounts.push(created);
        return created;
    }

    updateAccount(id: string, updates: UpdateAccountDto) {
        this.accounts = this.accounts.map((account) => {
            if (account._id === id)
                account = {
                    ...account,
                    ...updates,
                };
            return account;
        });
        return this.findAccount(id);
    }
}
