import { ArgumentsHost, Catch } from '@nestjs/common';
import { WinstonService } from '@app/winston';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
    private readonly logger: WinstonService = new WinstonService(
        ExceptionFilter.name,
    );
    catch(exception: unknown, host: ArgumentsHost) {
        console.log('ex', exception);
        this.logger.error((exception as Error).message, ExceptionFilter.name);
        super.catch(exception, host);
    }
}
