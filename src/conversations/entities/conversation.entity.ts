import { Conversation as PrismaConversation } from '@prisma/client';
import { Accounts } from 'src/accounts/entities/accounts.entity';
export class Conversation implements PrismaConversation {
    id: number;
    members: Accounts[];
    createdByid: number;
    createdAt: Date;
    updatedAt: Date;
}
