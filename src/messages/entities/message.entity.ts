import { Message as PrismaMessage } from '@prisma/client';
export class Message implements PrismaMessage {
    id: number;
    body: string;
    media: string | null;
    mediaType: string | null;
    createdById: number;
    conversationId: number;
    createdAt: Date;
    updatedAt: Date;
}
