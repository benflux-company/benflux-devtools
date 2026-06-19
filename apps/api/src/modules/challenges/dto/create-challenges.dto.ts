import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengesDto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}