import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === "production";
    
    // Log the full error for the developer internally
    this.logger.error(
      `Exception thrown at ${ctx.getRequest().url}: ${
        exception instanceof Error ? exception.stack : exception
      }`,
    );

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      // In production, we never reveal the raw error message if it's not a controlled HttpException
      message: isProduction && httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
        ? "An unexpected error occurred. Please try again later."
        : typeof message === "object" ? (message as any).message || message : message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
