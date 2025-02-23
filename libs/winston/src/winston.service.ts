import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class WinstonService extends ConsoleLogger {
    private readonly logger: winston.Logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        ),
        level: 'info',
        transports: [
            new winston.transports.File({
                format: winston.format.json(),
                level: 'info',
                dirname: path.join(__dirname, '..', '..', 'logs'),
                maxsize: 10240 * 10240,
            }),
        ],
    });

    log(message: any, context?: string) {
        this.logger.info(`${message}\t${context}`);
        super.log(message, context);
    }

    error(message: any, stackOrContext?: string) {
        this.logger.error(`${message}\t${stackOrContext}`);
        super.error(message, stackOrContext);
    }
}
