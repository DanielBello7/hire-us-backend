import { ArgumentsHost, Catch } from '@nestjs/common';
import { WinstonService } from 'src/winston/winston.service';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionFilterFilter extends BaseExceptionFilter {
    private readonly logger: WinstonService = new WinstonService(
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
