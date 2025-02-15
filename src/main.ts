import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionFilter } from '../libs/common/src/exception/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.use(helmet());
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
