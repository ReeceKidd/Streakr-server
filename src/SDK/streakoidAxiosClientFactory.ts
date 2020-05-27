import axios, { AxiosInstance } from 'axios';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

export const streakoidAxiosClientFactory = (
    applicationUrl: string,
    timezone?: string,
    authorisation?: string,
): AxiosInstance => {
    let headers: {
        'Content-Type'?: string;
        [SupportedRequestHeaders.Timezone]?: string;
        [SupportedRequestHeaders.Authorization]?: string;
    } = {
        'Content-Type': 'application/json',
    };
    if (timezone) {
        headers = { ...headers, [SupportedRequestHeaders.Timezone]: timezone };
    }
    if (authorisation) {
        headers = { ...headers, [SupportedRequestHeaders.Authorization]: authorisation };
    }
    return axios.create({
        headers,
        baseURL: applicationUrl,
    });
};
