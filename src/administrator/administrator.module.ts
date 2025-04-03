import { Module, OnModuleInit } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { RegisterService } from 'src/register/register.service';
import { ACCOUNT_ROLES_ENUM } from '@app/roles';

@Module({
    exports: [AdministratorService],
    controllers: [AdministratorController],
    imports: [DatabaseModule],
    providers: [AdministratorService, AccountsModule],
})
export class AdministratorModule implements OnModuleInit {
    constructor(
        private readonly admins: AdministratorService,
        private readonly register: RegisterService,
    ) {}

    async onModuleInit() {
        /**
         * check if there's any existing admin upon initial loading of the application.
         * if there isn't any, create one
         */
        const response = await this.admins.findAll();
        if (response.length < 1) {
            return this.register.registerAdministrator({
                email: 'admin@example.com',
                name: 'admin admin',
                password: 'Password1$',
                role: ACCOUNT_ROLES_ENUM.ADMINISTRATOR,
            });
        } else {
            return;
        }
    }
}
