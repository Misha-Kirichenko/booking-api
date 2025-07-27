import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import { CONSTANTS } from '@common';

const { RES_MESSAGES: { ERROR: { UNAVAILABLE, WRONG } } } = CONSTANTS;

@Catch()
export class AxiosErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(AxiosErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (this.isAxiosError(exception)) {
      const axiosError = exception as AxiosError;
      const data = axiosError.response?.data;
      const status = axiosError.response?.status ?? 503;

      let message: unknown;

      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object' && data !== null && 'message' in data) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      } else {
        message = axiosError.message || UNAVAILABLE;
      }

      this.logger.error(`Axios error: ${message}`);

      return response.status(status).json({
        statusCode: status,
        message,
      });
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    this.logger.error('Unhandled exception', exception as any);

    return response.status(500).json({
      statusCode: 500,
      message: WRONG,
    });
  }

  private isAxiosError(exception: any): exception is AxiosError {
    return exception?.isAxiosError && exception?.config && exception?.toJSON;
  }
}

