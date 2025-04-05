/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionFilter } from '@app/exception';
import { ValidationPipe } from '@nestjs/common';
import { ACTIVE } from '@app/constants';
import helmet from 'helmet';
import * as uuid from 'uuid';
import * as session from 'express-session';
import * as cookie from 'cookie-parser';

const Store = require('connect-sqlite3')(session);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.use(helmet());
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(cookie());

    app.use(
        session({
            secret: ACTIVE.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
            },
            genid: () => uuid.v4(),
            store: new Store({
                db: ACTIVE.DB_NAME,
                dir: ACTIVE.DATABASE_URI,
            }),
        }),
    );
    await app.listen(ACTIVE.PORT);
}
void bootstrap();
