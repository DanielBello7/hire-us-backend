import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
    controllers: [ResponseController],
    exports: [ResponseService],
    imports: [DatabaseModule],
    providers: [ResponseService],
})
export class ResponseModule {}
