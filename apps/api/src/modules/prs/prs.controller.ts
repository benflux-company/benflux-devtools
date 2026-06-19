import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Throttle } from '@nestjs/throttler'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PrsService } from './prs.service'
import { SubmitPrDto } from './dto/submit-pr.dto'
import { Request } from 'express'

@ApiTags('prs')
@ApiBearerAuth('JWT')
@Controller('prs')
export class PrsController {
  constructor(private readonly prsService: PrsService) {}

  /**
   * Submit a Pull Request for a challenge.
   * Strictly rate-limited to 5 req / 60s per IP to prevent spam.
   */
  @ApiOperation({ summary: 'Submit a pull request for a challenge' })
  @ApiResponse({ status: 201, description: 'PR submitted successfully' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  submitPr(@Req() req: Request, @Body() dto: SubmitPrDto) {
    const user = req.user as any
    return this.prsService.submit(user.id, dto)
  }

  /**
   * Get all submitted PRs for the current user.
   * Uses global rate limit (100 req / 60s).
   */
  @ApiOperation({ summary: 'Get my submitted pull requests' })
  @ApiResponse({ status: 200, description: 'List of submitted PRs' })
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyPrs(@Req() req: Request) {
    const user = req.user as any
    return this.prsService.findByUser(user.id)
  }

  /**
   * Get a single PR by its ID.
   */
  @ApiOperation({ summary: 'Get PR by ID' })
  @ApiResponse({ status: 200, description: 'PR details' })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getPr(@Param('id') id: string) {
    return this.prsService.findOne(id)
  }
}
