/* eslint-disable @typescript-eslint/no-explicit-any */
import app from '../../src/app';
import supertest from 'supertest';
import { getIdToken } from '../setup/getIdToken';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

export const request = supertest(app);

export const getRequest = async ({ route }: { route: string }): Promise<any> => {
    const idToken = await getIdToken();
    const response = await request
        .get(route)
        .set(SupportedRequestHeaders.Timezone, 'Europe/London')
        .set(SupportedRequestHeaders.Authorization, idToken);
    return response.body;
};

export const postRequest = async ({ route, params }: { route: string; params: any }): Promise<any> => {
    const idToken = await getIdToken();
    const response = await request
        .post(route)
        .send(params)
        .set(SupportedRequestHeaders.Timezone, 'Europe/London')
        .set(SupportedRequestHeaders.Authorization, idToken);
    return response.body;
};

export const patchRequest = async ({ route, params }: { route: string; params: any }): Promise<any> => {
    const idToken = await getIdToken();
    const response = await request
        .patch(route)
        .send(params)
        .set(SupportedRequestHeaders.Timezone, 'Europe/London')
        .set(SupportedRequestHeaders.Authorization, idToken);
    return response.body;
};

export const deleteRequest = async ({ route }: { route: string }): Promise<any> => {
    const idToken = await getIdToken();
    const response = await request
        .delete(route)
        .set(SupportedRequestHeaders.Timezone, 'Europe/London')
        .set(SupportedRequestHeaders.Authorization, idToken);
    return response.body;
};
