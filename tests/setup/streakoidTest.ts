import * as fetch from 'node-fetch';

import { streakoidClientFactory } from '../../src';
import { londonTimezone, streakoidFactory } from '../../src/streakoid';
import { getIdToken } from './getIdToken';
import { getServiceConfig } from '../../getServiceConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).fetch = fetch;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).navigator = {
    userAgent: 'NodeJS',
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const streakoidTest = async () => {
    const idToken = await getIdToken();
    const applicationUrl = getServiceConfig().APPLICATION_URL;
    const streakoidClient = streakoidClientFactory(applicationUrl, londonTimezone, idToken);
    return streakoidFactory(streakoidClient);
};

export { streakoidTest };
