import { streakoidTestSDKFactory } from '@streakoid/streakoid-sdk/lib/streakoidTestSDKFactory';
import appImport from '../../src/app';
import { getDatabaseURI } from './getDatabaseURI';
import { getIdToken } from './getIdToken';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const streakoidTestSDK = ({ testName }: { testName: string }) => {
    return streakoidTestSDKFactory({ testName, getDatabaseURI, getIdToken, app: appImport });
};
