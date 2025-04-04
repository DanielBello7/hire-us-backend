import { Module, OnModuleInit } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { SignUpService } from 'src/signup/signup.service';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

@Module({
    exports: [AdminsService],
    controllers: [AdminsController],
    imports: [DatabaseModule],
    providers: [AdminsService, AccountsModule],
})
export class AdminsModule implements OnModuleInit {
    constructor(
        private readonly admins: AdminsService,
        private readonly register: SignUpService,
    ) {}

    async onModuleInit() {
        /**
         * check if there's any existing admin upon initial loading of the application.
         * if there isn't any, create one
         */
        const response = await this.admins.get();
        if (response.length < 1) {
            return this.register.registerAdministrator({
                email: 'admin@example.com',
                name: 'admin admin',
                password: 'Password1$',
                role: ACCOUNT_ROLES_ENUM.ADMIN,
            });
        } else {
            return;
        }
    }
}
