import { Test, TestingModule } from '@nestjs/testing';
import { ExamStatusController } from './exam-status.controller';
import { ExamStatusService } from './exam-status.service';

describe('ExamStatusController', () => {
    let controller: ExamStatusController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExamStatusController],
            providers: [ExamStatusService],
        }).compile();

        controller = module.get<ExamStatusController>(ExamStatusController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
