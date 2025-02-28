export type CONSTANTS = {
    DATABASE_URI: string;
    PORT: number;
    NODE_ENV: 'development' | 'production';
    JWT_SECRET: string;
    JWT_EXPIRES: string;
    SESSION_SECRET: string;
    DB_NAME: string;
};

export const CURRENT: 'DEV' | 'PRO' =
    ((process.env.NODE_ENV as string) ?? '') === 'development' ? 'DEV' : 'PRO';

export const EXT: 'dev' | 'pro' =
    ((process.env.NODE_ENV as string) ?? '') === 'development' ? 'dev' : 'pro';
