import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DatabaseService, PrismaDatabaseService } from '@app/database';
import { ExamsService } from 'src/exams/exams.service';
import { OptionsService } from 'src/options/options.service';

@Injectable()
export class QuestionsService {
    constructor(
        private readonly exams: ExamsService,
        private readonly db: DatabaseService,
        private readonly options: OptionsService,
    ) {}

    /** This checks if a particular index has been used */
    async checkIfIndexIsUsed(examid: number, index: number) {
        return this.db.question.findFirst({
            where: {
                examid,
                index,
            },
        });
    }

    /**
     * Retrieves questions for an exam and include the options for each question
     */
    async getExamQuestionsUsingExamId(examid: number) {
        return this.db.question.findMany({
            where: {
                examid,
            },
            include: {
                Options: true,
            },
        });
    }

    /**
     * This records a new question to the database,
     * This also updates the exam question count
     */
    async saveQuestion(
        body: CreateQuestionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        if (await this.checkIfIndexIsUsed(body.examid, body.index)) {
            throw new BadRequestException('Index has been used');
        }

        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            const exam = await this.exams.findById(body.examid);
            await this.exams.modify(
                exam.id,
                {
                    questions: exam.questions + 1,
                },
                db,
            );
            return this.create(body, db);
        });
    }

    /**
     * Deletes a question,
     * This also removes the options,
     * This reduces the questions on the exam count
     */
    async deleteQuestion(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const question = await this.findById(id);
        const exam = await this.exams.findById(question.examid);
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            await this.remove(id, db);
            await this.exams.update(
                question.examid,
                { questions: exam.questions - 1 },
                db,
            );
            await this.options.removeMany({ questionId: id }, db);
        });
    }

    /**
     * Deletes plenty questions where the exam id is a given input,
     * it also deletes the options of all the deleted questions
     */
    async deleteQuestionsUsingExamId(
        examid: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        const response = await this.db.question.findMany({
            where: { examid },
        });
        const ids = response.map((item) => item.id);
        return this.db.$transaction(async (tx) => {
            const db = database ?? tx;
            await db.question.deleteMany({
                where: {
                    examid,
                },
            });
            await this.options.removeManyUsingInclusive(ids, db);
        });
    }

    /** This updates a question but excludes certain fields */
    async modify(
        id: number,
        body: UpdateQuestionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { examid: examId, ...rest } = body;
        return this.update(id, rest, database);
    }

    async create(
        body: CreateQuestionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.question.create({
            data: {
                ...body,
            },
        });
    }

    async get(query: Record<string, any> = {}) {
        let pageNum = 1;
        let pickNum = 5;

        let options = {};

        let skip = pickNum * (pageNum - 1);

        if (query) {
            const { page, pick } = query;
            pageNum = Number(page ?? 1);
            pickNum = Number(pick ?? 5);
            skip = pickNum * (pageNum - 1);
            options = {
                ...options,
                ...Object.fromEntries(
                    Object.entries(query).filter(([key]) =>
                        [
                            'id',
                            'examid',
                            'type',
                            'body',
                            'createdAt',
                            'updatedAt',
                        ].includes(key),
                    ),
                ),
            };
        }

        return this.db.question.findMany({
            where: options,
            skip,
            take: pickNum,
        });
    }

    async findById(id: number) {
        const response = await this.db.question.findFirst({
            where: {
                id,
            },
            include: {
                Options: true,
            },
        });
        if (!response) throw new NotFoundException();
        return response;
    }

    async update(
        id: number,
        body: UpdateQuestionDto,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.question.update({
            where: {
                id,
            },
            data: body,
        });
    }

    async remove(
        id: number,
        database?: DatabaseService | PrismaDatabaseService,
    ) {
        let db: DatabaseService | PrismaDatabaseService;
        if (database) db = database;
        else db = this.db;
        return db.question.delete({
            where: {
                id,
            },
        });
    }
}
