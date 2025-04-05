import { AccountsService } from './accounts.service';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AccountsController } from './accounts.controller';

@Module({
    controllers: [AccountsController],
    exports: [AccountsService],
    imports: [
        DatabaseModule,
        // passport
    ],
    providers: [AccountsService],
})
export class AccountsModule {}
