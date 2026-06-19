import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { CreateChallengesDto } from './dto/create-challenges.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

export class ChallengeDto {
  @ApiProperty({ description: 'The challenge ID', example: '1' })
  id: string;
}

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  @Get()
  @ApiOperation({ summary: 'List all challenges', description: 'Returns paginated list of weekly challenges' })
  @ApiResponse({ status: 200, description: 'Challenges retrieved', type: [ChallengeDto] })
  findAll() {
    return [];
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new challenge (admin only)' })
  @ApiResponse({ status: 201, description: 'Challenge created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateChallengesDto) {
    return { success: true };
  }
}