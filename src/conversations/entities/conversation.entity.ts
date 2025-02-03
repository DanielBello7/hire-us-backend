import { Conversation as PrismaConversation } from '@prisma/client';
import { Accounts } from 'src/accounts/entities/accounts.entity';
export class Conversation implements PrismaConversation {
    id: number;
    createdById: number;
    members: Accounts[];
    createdAt: Date;
    updatedAt: Date;
}
