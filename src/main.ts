import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionFilterFilter } from './exception-filter/exception-filter.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    /**
     * to use the logger service globally - use:
     *
     * const app = await NestFactory.create(AppModule, { bufferLogs: true });
     * app.useLogger(app.get(WinstonLoggerService));
     */
    const app = await NestFactory.create(AppModule);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilterFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
