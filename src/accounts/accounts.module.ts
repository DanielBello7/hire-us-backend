import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [AccountsController],
    exports: [AccountsService],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [AccountsService],
})
export class AccountsModule {}
