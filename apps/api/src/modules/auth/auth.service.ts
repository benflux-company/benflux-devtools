import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  // Authentication itself happens in benflux-auth; the gateway only vouches
  // for a benfluxUserId (see GatewayAuthGuard), not a profile — this just
  // mirrors that identity into our own User record so devtools-specific data
  // (wallet, PRs, leaderboard) has something to hang off. username/email are
  // placeholders until a profile-sync step (calling benflux-auth's own user
  // API) fills them in for real.
  async findOrCreateUserByGatewayIdentity(benfluxUserId: string): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: { benfluxUserId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          benfluxUserId,
          username: `user-${benfluxUserId.slice(0, 8)}`,
          wallet: { create: { balance: 0 } },
        },
      });
      this.logger.log(`New user registered: ${user.id}`);
    }

    return user;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
  }
}
