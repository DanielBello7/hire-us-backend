import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [PositionsService],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [PositionsController],
    exports: [PositionsService],
})
export class PositionsModule {}
