import { Message as PrismaMessage } from '@prisma/client';
export class Message implements PrismaMessage {
    id: number;
    body: string;
    media: string | null;
    mediaType: string | null;
    createdByid: number;
    conversationid: number;
    createdAt: Date;
    updatedAt: Date;
}
