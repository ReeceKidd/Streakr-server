import { streakoidAxiosSDKFactory } from './streakoidAxiosSDKFactory';
import { streakoidAxiosClientFactory } from './streakoidAxiosClientFactory';

export const londonTimezone = 'Europe/London';

const applicationUrl = 'http://localhost:3001';

export const streakoidLocalClient = streakoidAxiosClientFactory(applicationUrl, londonTimezone);

export const streakoidLocalSDK = streakoidAxiosSDKFactory(streakoidLocalClient);
