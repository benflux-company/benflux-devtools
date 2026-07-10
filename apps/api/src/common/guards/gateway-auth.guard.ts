import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { isTimestampFresh, verifyGatewaySignature } from '../utils/gateway-identity';
import { AuthService } from '../../modules/auth/auth.service';

const SESSION_COOKIE_NAME = 'benflux_session';

// benflux-auth owns the session; we don't validate one ourselves. Instead we
// forward the incoming benflux_session cookie to its /verify endpoint (the
// same one nginx would call via auth_request, just invoked directly service-
// to-service) and trust the HMAC-signed X-Benflux-* headers it returns. See
// apps/api/src/common/utils/gateway-identity.ts for the shared HMAC scheme.
@Injectable()
export class GatewayAuthGuard implements CanActivate {
  private readonly logger = new Logger(GatewayAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const sessionCookie = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
    if (!sessionCookie) {
      throw new UnauthorizedException('No session');
    }

    const authApiUrl = this.configService.get<string>('auth.apiUrl');
    const secret = this.configService.get<string>('gateway.hmacSecret');
    if (!authApiUrl || !secret) {
      throw new UnauthorizedException('Auth verification is not configured');
    }

    let response: Response;
    try {
      response = await fetch(`${authApiUrl}/verify`, {
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}`,
          'x-benflux-service': 'benflux-devtools',
        },
      });
    } catch (err) {
      this.logger.error(`Failed to reach benflux-auth /verify: ${(err as Error).message}`);
      throw new UnauthorizedException('Could not verify session');
    }

    if (response.status !== 200) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const userId = response.headers.get('x-benflux-user-id');
    const orgId = response.headers.get('x-benflux-org-id') ?? '';
    const roles = response.headers.get('x-benflux-roles') ?? '';
    const permissions = response.headers.get('x-benflux-permissions') ?? '';
    const fullName = response.headers.get('x-benflux-full-name') ?? '';
    const phone = response.headers.get('x-benflux-phone') ?? '';
    const timestamp = response.headers.get('x-benflux-timestamp');
    const signature = response.headers.get('x-benflux-signature');

    if (!userId || !timestamp || !signature) {
      throw new UnauthorizedException('Missing gateway identity headers');
    }
    if (!isTimestampFresh(timestamp)) {
      throw new UnauthorizedException('Gateway identity headers are stale');
    }
    if (!verifyGatewaySignature(secret, { userId, orgId, roles, permissions, fullName, phone, timestamp }, signature)) {
      throw new UnauthorizedException('Invalid gateway signature');
    }

    const user = await this.authService.findOrCreateUserByGatewayIdentity(userId);

    request.user = {
      ...user,
      orgId: orgId || null,
      roles: roles ? roles.split(',').filter(Boolean) : [],
      permissions: permissions ? permissions.split(',').filter(Boolean) : [],
      fullName: fullName ? decodeURIComponent(fullName) : '',
      phone: phone ? decodeURIComponent(phone) : '',
    };

    return true;
  }
}
