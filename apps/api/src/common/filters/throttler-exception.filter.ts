import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Request, Response } from 'express'

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThrottlerExceptionFilter.name)

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = HttpStatus.TOO_MANY_REQUESTS

    this.logger.warn(`Rate limit exceeded: ${request.method} ${request.url} — IP: ${request.ip}`)

    response
      .status(status)
      .header('X-RateLimit-Limit', '100')
      .header('X-RateLimit-Remaining', '0')
      .header('Retry-After', '60')
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          'Too many requests. You have exceeded the rate limit for this endpoint. Please wait 60 seconds before retrying.',
        error: 'Too Many Requests',
      })
  }
}
