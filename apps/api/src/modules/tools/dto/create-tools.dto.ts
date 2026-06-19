import { ApiProperty } from '@nestjs/swagger';

export class CreateToolsDto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}