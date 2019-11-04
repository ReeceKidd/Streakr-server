import mongoose from 'mongoose';

const tearDownDatabase = async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    return mongoose.disconnect();
};

export { tearDownDatabase };
