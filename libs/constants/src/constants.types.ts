type CONSTANTS = {
    DATABASE_URI: string;
    PORT: number;
    NODE_ENV: 'development' | 'production';
    JWT_SECRET: string;
    JWT_EXPIRES: string;
    SESSION_SECRET: string;
    DB_NAME: string;
};

const NODE_ENV = (process.env.NODE_ENV as string) ?? '';
const EXT: 'dev' | 'pro' = NODE_ENV === 'development' ? 'dev' : 'pro';
const CURRENT: 'DEV' | 'PRO' = NODE_ENV === 'development' ? 'DEV' : 'PRO';

export { CURRENT, EXT, CONSTANTS };
