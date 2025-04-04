import { Progress as PrismaProgress } from '@prisma/client';
import { PROGRESS_ENUM } from '../dto/create-progress.dto';
export class Progress implements PrismaProgress {
    id: number;
    employeeid: number;
    score: number | null;
    examid: number;
    completed: boolean;
    lastQuestionid: number | null;
    status: PROGRESS_ENUM;
    createdAt: Date;
    updatedAt: Date;
}
