import { getServiceConfig } from '../../src/getServiceConfig';
const { DATABASE_URI } = getServiceConfig();

const isTestEnvironment = (): boolean => {
    if (process.env.NODE_ENV === 'test' && DATABASE_URI.includes('test')) return true;
    throw new Error('Not test environment');
};

export { isTestEnvironment };
