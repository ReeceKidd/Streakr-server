import { streakoidFactory, streakoidClientFactory } from '@streakoid/streakoid-sdk';

import { getServiceConfig } from './getServiceConfig';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';
const { APPLICATION_URL } = getServiceConfig();

const streakoidClient = streakoidClientFactory(APPLICATION_URL, londonTimezone);

const streakoid = streakoidFactory(streakoidClient);
export default streakoid;
