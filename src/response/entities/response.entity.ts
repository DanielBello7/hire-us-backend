import { Response as PrismResponse } from '@prisma/client';
export class Response implements PrismResponse {
    id: number;
    questionid: number;
    employeeid: number;
    optionid: number | null;
    correct: boolean;
    examid: number;
    body: string | null;
    createdAt: Date;
    updatedAt: Date;
}
