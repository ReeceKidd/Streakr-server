import mongoose from 'mongoose';
import { getServiceConfig } from '../../src/getServiceConfig';
const { DATABASE_URI } = getServiceConfig();

const setupDatabase = async (): Promise<void> => {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    await mongoose.connect(DATABASE_URI);
    return mongoose.connection.dropDatabase();
};

export { setupDatabase };
