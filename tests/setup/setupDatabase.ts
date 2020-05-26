import mongoose from 'mongoose';
import { getServiceConfig } from '../../src/getServiceConfig';
const { DATABASE_URI } = getServiceConfig();

const setupDatabase = async (): Promise<typeof mongoose> => {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    const database = await mongoose.connect(DATABASE_URI);
    await mongoose.connection.dropDatabase();
    return database;
};

export { setupDatabase };
