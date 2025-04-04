import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { DatabaseModule } from '@app/database';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    exports: [AdminsService],
    controllers: [AdminsController],
    imports: [
        DatabaseModule,
        AccountsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [AdminsService],
})
export class AdminsModule {}
