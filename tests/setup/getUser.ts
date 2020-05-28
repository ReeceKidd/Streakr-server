import { getServiceConfig } from '../../src/getServiceConfig';
import { streakoidTestSDKFactory } from '../../src/SDK/streakoidTestSDKFactory';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

const { COGNITO_USERNAME, COGNITO_EMAIL } = getServiceConfig();

const getUser = async ({ testName }: { testName: string }): Promise<PopulatedCurrentUser> => {
    const user = await streakoidTestSDKFactory({ testName }).users.create({
        username: COGNITO_USERNAME,
        email: COGNITO_EMAIL,
    });
    return user;
};

export { getUser };
