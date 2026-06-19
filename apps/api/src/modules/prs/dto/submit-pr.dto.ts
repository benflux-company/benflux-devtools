import { IsString, IsUrl, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SubmitPrDto {
  @ApiProperty({
    description: 'GitHub Pull Request URL',
    example: 'https://github.com/user/repo/pull/1',
  })
  @IsUrl()
  githubPrUrl: string

  @ApiProperty({ description: 'PR title' })
  @IsString()
  title: string

  @ApiProperty({ description: 'Challenge ID this PR is for' })
  @IsString()
  challengeId: string

  @ApiPropertyOptional({ description: 'Short description of the approach' })
  @IsOptional()
  @IsString()
  description?: string
}
