import { Progress as PrismaProgress } from '@prisma/client';
import { ProgressEnum } from '../dto/create-progress.dto';
export class Progress implements PrismaProgress {
    id: number;
    employeeId: number;
    score: number | null;
    isCompleted: boolean;
    lastQuestionId: number | null;
    status: ProgressEnum;
    createdAt: Date;
    updatedAt: Date;
}
