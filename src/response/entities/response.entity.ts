import { Response as PrismResponse } from '@prisma/client';
export class Response implements PrismResponse {
    id: number;
    questionId: number;
    employeeId: number;
    optionId: number | null;
    isCorrect: boolean;
    examId: number;
    body: string | null;
    createdAt: Date;
    updatedAt: Date;
}
