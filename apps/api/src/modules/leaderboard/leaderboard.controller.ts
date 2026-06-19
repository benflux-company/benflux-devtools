import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  @Get()
  @ApiOperation({ summary: 'Get all leaderboard', description: 'Retrieve a list of leaderboard' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return [];
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new leaderboard', description: 'Creates a new leaderboard entry' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateLeaderboardDto) {
    return { success: true };
  }
}