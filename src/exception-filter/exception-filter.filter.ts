import { ArgumentsHost, Catch } from '@nestjs/common';
import { WinstonLoggerService } from 'src/winston-logger/winston-logger.service';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionFilterFilter extends BaseExceptionFilter {
    private readonly logger: WinstonLoggerService = new WinstonLoggerService(
        ExceptionFilterFilter.name,
    );
    catch(exception: unknown, host: ArgumentsHost) {
        this.logger.error(
            (exception as Error).message,
            ExceptionFilterFilter.name,
        );
        super.catch(exception, host);
    }
}
