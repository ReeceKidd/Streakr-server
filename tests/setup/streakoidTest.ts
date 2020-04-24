import { getIdToken } from './getIdToken';
import { getServiceConfig } from '../../src/getServiceConfig';
import { streakoidClientFactory, streakoidFactory } from '@streakoid/streakoid-models/lib';
const { APPLICATION_URL } = getServiceConfig();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const streakoidTest = async () => {
    const idToken = await getIdToken();
    const streakoidClient = streakoidClientFactory(APPLICATION_URL, 'Europe/London', idToken);
    return streakoidFactory(streakoidClient);
};

export { streakoidTest };
