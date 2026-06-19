import { Module } from '@nestjs/common'
import { PrsController } from './prs.controller'
import { PrsService } from './prs.service'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PrsController],
  providers: [PrsService],
})
export class PrsModule {}
