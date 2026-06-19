import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePrsDto } from './dto/create-prs.dto';

@ApiTags('prs')
@Controller('prs')
export class PrsController {
  @Get()
  @ApiOperation({ summary: 'Get all prs', description: 'Retrieve a list of prs' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return [];
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new prs', description: 'Creates a new prs entry' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreatePrsDto) {
    return { success: true };
  }
}