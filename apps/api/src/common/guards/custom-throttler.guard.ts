import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any,
  ): Promise<void> {
    const res = context.switchToHttp().getResponse()

    // We manually set Limit and Remaining before throwing the exception,
    // so they are present in the 429 response.
    res.header('X-RateLimit-Limit', String(throttlerLimitDetail.limit))
    res.header('X-RateLimit-Remaining', '0')

    throw new ThrottlerException(
      'Too many requests. You have exceeded the rate limit for this endpoint. Please wait a moment before retrying.',
    )
  }
}
