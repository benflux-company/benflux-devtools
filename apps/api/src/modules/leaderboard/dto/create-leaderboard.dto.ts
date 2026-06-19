import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaderboardDto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}