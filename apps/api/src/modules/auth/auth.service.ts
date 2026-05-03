import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findOrCreateUser(githubUser: {
    githubId: string;
    username: string;
    email: string | null;
    avatarUrl: string | null;
    bio: string | null;
    githubUrl: string | null;
  }): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: { githubId: githubUser.githubId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          githubId: githubUser.githubId,
          username: githubUser.username,
          email: githubUser.email,
          avatarUrl: githubUser.avatarUrl,
          bio: githubUser.bio,
          githubUrl: githubUser.githubUrl,
          wallet: { create: { balance: 0 } },
        },
      });
      this.logger.log(`New user registered: ${user.username}`);
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: githubUser.avatarUrl,
          email: githubUser.email ?? user.email,
          bio: githubUser.bio,
          githubUrl: githubUser.githubUrl,
        },
      });
    }

    return user;
  }

  generateTokens(user: User) {
    const payload = { sub: user.id, username: user.username, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '1h'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
    });

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
  }
}
