import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateWalletDto } from './dto/create-wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  @Get()
  @ApiOperation({ summary: 'Get all wallet', description: 'Retrieve a list of wallet' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return [];
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new wallet', description: 'Creates a new wallet entry' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateWalletDto) {
    return { success: true };
  }
}