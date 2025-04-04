import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { DatabaseModule } from '@app/database';
import { ProgressModule } from 'src/progress/progress.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [ResponseController],
    exports: [ResponseService],
    imports: [
        DatabaseModule,
        ProgressModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [ResponseService],
})
export class ResponseModule {}
