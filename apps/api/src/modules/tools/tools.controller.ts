import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateToolsDto } from './dto/create-tools.dto';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  @Get()
  @ApiOperation({ summary: 'Get all tools', description: 'Retrieve a list of tools' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return [];
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new tools', description: 'Creates a new tools entry' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateToolsDto) {
    return { success: true };
  }
}