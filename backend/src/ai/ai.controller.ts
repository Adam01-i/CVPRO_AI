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
}
