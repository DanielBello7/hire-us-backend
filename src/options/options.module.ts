import { OptionsController } from './options.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { PassportModule } from '@nestjs/passport';

@Module({
    exports: [OptionsService],
    providers: [OptionsService],
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [OptionsController],
})
export class OptionsModule {}
