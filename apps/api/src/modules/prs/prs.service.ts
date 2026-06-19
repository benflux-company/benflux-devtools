import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { SubmitPrDto } from './dto/submit-pr.dto'

@Injectable()
export class PrsService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitPrDto) {
    return this.prisma.pullRequest.create({
      data: {
        githubPrUrl: dto.githubPrUrl,
        title: dto.title,
        description: dto.description ?? null,
        userId,
        challengeId: dto.challengeId,
      },
    })
  }

  async findByUser(userId: string) {
    return this.prisma.pullRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const pr = await this.prisma.pullRequest.findUnique({ where: { id } })
    if (!pr) throw new NotFoundException(`PR with id ${id} not found`)
    return pr
  }
}
