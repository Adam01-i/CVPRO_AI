import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchCvDto, QueryMatchingDto } from './dto/match-cv.dto';
import { AiService } from './ai.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('matching')
  matchCv(@CurrentUser() user: JwtPayload, @Body() dto: MatchCvDto) {
    return this.aiService.matchCvToJobOffer(user.id, dto.cvId, dto.jobOfferId);
  }

  @Post('analyze/cv/:cvId')
  analyzeCv(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.analyzeCvForUser(user.id, cvId);
  }

  @Get('analyze/cv/:cvId/latest')
  getLatestCvAnalysis(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.getLatestCvAnalysisForUser(user.id, cvId);
  }

  @Get('analyze/cv/:cvId/history')
  getCvAnalysisHistory(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.getCvAnalysisHistoryForUser(user.id, cvId);
  }

  @Get('analyze/:analysisId')
  getCvAnalysisById(@CurrentUser() user: JwtPayload, @Param('analysisId') analysisId: string) {
    return this.aiService.getCvAnalysisByIdForUser(user.id, analysisId);
  }

  @Get('matching/:cvId/:jobOfferId')
  getMatching(
    @CurrentUser() user: JwtPayload,
    @Param('cvId') cvId: string,
    @Param('jobOfferId') jobOfferId: string,
  ) {
    return this.aiService.getMatchingForUser(user.id, cvId, jobOfferId);
  }

  @Get('matching')
  listMatchings(@CurrentUser() user: JwtPayload, @Query() query: QueryMatchingDto) {
    return this.aiService.listMatchingsForUser(user.id, query);
  }

  @Get('matching/cv/:cvId/top-jobs')
  getTopJobsForCv(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.getTopJobsForCv(user.id, cvId);
  }

  @Post('improve/cv/:cvId')
  improveCv(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.improveCvForUser(user.id, cvId);
  }

  @Post('improve/cv/:cvId/job/:jobOfferId')
  improveCvForJob(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string, @Param('jobOfferId') jobOfferId: string) {
    return this.aiService.improveCvForUserWithJobOffer(user.id, cvId, jobOfferId);
  }

  @Get('improve/cv/:cvId/latest')
  getLatestCvImprovement(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.getLatestCvImprovementForUser(user.id, cvId);
  }

  @Get('improve/cv/:cvId/history')
  getCvImprovementHistory(@CurrentUser() user: JwtPayload, @Param('cvId') cvId: string) {
    return this.aiService.getCvImprovementHistoryForUser(user.id, cvId);
  }
}
