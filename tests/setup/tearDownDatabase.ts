import mongoose from 'mongoose';
import { isTestEnvironment } from './isTestEnvironment';

const tearDownDatabase = async ({ database }: { database: typeof mongoose }): Promise<void> => {
    if (isTestEnvironment()) {
        return database.connection.dropDatabase();
    }
};

export { tearDownDatabase };
