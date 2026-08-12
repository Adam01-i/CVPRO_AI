import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: jest.Mocked<Pick<AiService, 'matchCvToJobOffer' | 'analyzeCvForUser' | 'getLatestCvAnalysisForUser' | 'getCvAnalysisHistoryForUser' | 'getCvAnalysisByIdForUser' | 'getMatchingForUser' | 'listMatchingsForUser' | 'getTopJobsForCv'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            matchCvToJobOffer: jest.fn(),
            analyzeCvForUser: jest.fn(),
            getLatestCvAnalysisForUser: jest.fn(),
            getCvAnalysisHistoryForUser: jest.fn(),
            getCvAnalysisByIdForUser: jest.fn(),
            getMatchingForUser: jest.fn(),
            listMatchingsForUser: jest.fn(),
            getTopJobsForCv: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    service = module.get(AiService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates CV analysis requests to the service', () => {
    const user = { id: 'user-1', email: 'a@b.com', role: 'USER' as const };
    const response = { score: 82 };
    service.analyzeCvForUser.mockResolvedValue(response as any);

    return expect(controller.analyzeCv(user as any, 'cv-1')).resolves.toBe(response);
  });
});
