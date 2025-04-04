import { CONSTANTS } from './constants.types';

const ENVIRONMENTS: CONSTANTS = {
    DATABASE_URI: (process.env.DATABASE_URI as string) ?? '',
    NODE_ENV:
        (process.env.NODE_ENV as 'development' | 'production') ?? 'development',
    PORT: parseInt(process.env.PORT as string) ?? 3000,
    JWT_EXPIRES: (process.env.JWT_EXPIRES as string) ?? '',
    JWT_SECRET: (process.env.JWT_SECRET as string) ?? '',
    SESSION_SECRET: (process.env.SESSION_SECRET as string) ?? '',
    DB_NAME: (process.env.DB_NAME as string) ?? '',
};

export const ACTIVE = ENVIRONMENTS;
