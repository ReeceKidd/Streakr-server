import { streakoidFactory, streakoidClientFactory } from '@streakoid/streakoid-sdk';

import { getServiceConfig } from './getServiceConfig';

const { APPLICATION_URL } = getServiceConfig();

export const londonTimezone = 'Europe/London';

const streakoidClient = streakoidClientFactory(APPLICATION_URL, londonTimezone);

const streakoid = streakoidFactory(streakoidClient);
export default streakoid;
