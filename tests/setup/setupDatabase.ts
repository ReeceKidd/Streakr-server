import mongoose from 'mongoose';
import { getDatabaseURI } from './getDatabaseURI';

const setupDatabase = async ({ testName }: { testName: string }): Promise<typeof mongoose> => {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    const database = await mongoose.connect(getDatabaseURI({ testName }));
    await mongoose.connection.dropDatabase();
    return database;
};

export { setupDatabase };
