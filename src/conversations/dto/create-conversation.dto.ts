import { Expose } from 'class-transformer';

export class CreateConversationDto {
    @Expose()
    members: number[];

    @Expose()
    createdBy: number;
}
