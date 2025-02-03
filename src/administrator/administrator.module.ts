import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    controllers: [AdministratorController],
    exports: [AdministratorService],
    imports: [DatabaseModule],
    providers: [AdministratorService],
})
export class AdministratorModule {}
