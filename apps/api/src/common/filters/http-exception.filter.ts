import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', error: 'Internal Server Error' };

    const errorPayload: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error || 'Error'
          : 'Error',
      message:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exceptionResponse
          : exceptionResponse,
    };

    // No stack traces exposed in production
    if (process.env.NODE_ENV !== 'production' && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorPayload.stack = exception instanceof Error ? exception.stack : String(exception);
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(errorPayload);
  }
}
