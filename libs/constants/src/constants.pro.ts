import { CONSTANTS } from './constants.types';

export const PRODUCTION_CONSTANTS: CONSTANTS = {
    DATABASE_URI: 'file:./employee-db:prisma.db',
    NODE_ENV: 'production',
    PORT: 3000,
    JWT_EXPIRES: '24h',
    JWT_SECRET: '7d461be1da88ee69506748be7af42e35-18cd25e72cbvt-3',
};
