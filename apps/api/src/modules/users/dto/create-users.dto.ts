import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}