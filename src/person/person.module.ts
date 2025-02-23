import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { DatabaseModule } from '@app/database';

@Module({
    imports: [DatabaseModule],
    controllers: [PersonController],
    exports: [PersonService],
    providers: [PersonService],
})
export class PersonModule {}
