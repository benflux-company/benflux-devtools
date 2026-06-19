import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Throttle, SkipThrottle } from '@nestjs/throttler'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initiates GitHub OAuth login.
   * Rate-limited to 10 req / 60s per IP.
   */
  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to GitHub OAuth' })
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  githubLogin(@Req() _req: Request) {
    // Guard redirects automatically
  }

  /**
   * GitHub OAuth callback.
   * Rate-limited to 10 req / 60s per IP.
   */
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects with JWT tokens' })
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any
    const { accessToken, refreshToken } = this.authService.generateTokens(user)

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
  }

  /**
   * Returns the currently authenticated user profile.
   * Uses global rate limit (100 req / 60s).
   */
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user object' })
  @SkipThrottle()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: Request) {
    return req.user
  }
}
