import { getServiceConfig } from '../../src/getServiceConfig';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { streakoidTestSDK } from './streakoidTestSDK';

const { COGNITO_USERNAME, COGNITO_EMAIL } = getServiceConfig();

const getUser = async ({ testName }: { testName: string }): Promise<PopulatedCurrentUser> => {
    const user = await streakoidTestSDK({ testName }).users.create({
        username: COGNITO_USERNAME,
        email: COGNITO_EMAIL,
    });
    return user;
};

export { getUser };
