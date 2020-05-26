import mongoose from 'mongoose';
import { isTestEnvironment } from './isTestEnvironment';

const disconnectDatabase = async ({ database }: { database: typeof mongoose }): Promise<void> => {
    if (isTestEnvironment()) {
        return database.disconnect();
    }
};

export { disconnectDatabase };
