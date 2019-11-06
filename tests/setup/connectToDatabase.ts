import mongoose from 'mongoose';
import { getServiceConfig } from '../../src/getServiceConfig';
const { DATABASE_URI } = getServiceConfig();

const connectToDatabase = async (): Promise<void> => {
    await mongoose.connect(DATABASE_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
    return mongoose.connection.dropDatabase();
};

export { connectToDatabase };
