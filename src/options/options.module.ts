import { OptionsController } from './options.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';

@Module({
    exports: [OptionsService],
    providers: [OptionsService],
    imports: [DatabaseModule],
    controllers: [OptionsController],
})
export class OptionsModule {}
