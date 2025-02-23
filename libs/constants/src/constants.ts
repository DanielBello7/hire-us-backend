import { DEVELOPMENT_CONSTANTS } from './constants.dev';
import { PRODUCTION_CONSTANTS } from './constants.pro';
import { CURRENT } from './constants.types';

const ENVIRONMENTS = {
    PRO: PRODUCTION_CONSTANTS,
    DEV: DEVELOPMENT_CONSTANTS,
};
export const ACTIVE = ENVIRONMENTS[CURRENT];
