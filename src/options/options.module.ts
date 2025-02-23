import { OptionsController } from './options.controller';
import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';

@Module({
    exports: [OptionsService],
    providers: [OptionsService],
    imports: [DatabaseModule],
    controllers: [OptionsController],
})
export class OptionsModule {}
