import { Test, TestingModule } from '@nestjs/testing';
import { ExamStatusService } from './exam-status.service';

describe('ExamStatusService', () => {
    let service: ExamStatusService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ExamStatusService],
        }).compile();

        service = module.get<ExamStatusService>(ExamStatusService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
