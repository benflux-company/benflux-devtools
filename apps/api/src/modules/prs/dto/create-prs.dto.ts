import { ApiProperty } from '@nestjs/swagger';

export class CreatePrsDto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}