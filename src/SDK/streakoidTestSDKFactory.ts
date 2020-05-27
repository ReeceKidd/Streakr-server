import { StreakoidSDK, streakoidSDKFactory } from './streakoidSDKFactory';
import { apiTester } from './apiTester';
import { getDatabaseURI } from '../../tests/setup/getDatabaseURI';

export const streakoidTestSDKFactory = ({ testName }: { testName: string }): StreakoidSDK => {
    const { getRequest, getRequestActivityFeed, postRequest, patchRequest, deleteRequest } = apiTester({
        databaseURI: getDatabaseURI({ testName }),
    });

    return streakoidSDKFactory({ getRequest, getRequestActivityFeed, postRequest, patchRequest, deleteRequest });
};
