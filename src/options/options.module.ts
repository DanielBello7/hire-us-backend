import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
    exports: [OptionsService],
    providers: [OptionsService],
    imports: [DatabaseService],
    controllers: [OptionsController],
})
export class OptionsModule {}
