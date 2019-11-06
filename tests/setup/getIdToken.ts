/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import * as fetch from 'node-fetch';
(global as any).fetch = fetch;
(global as any).navigator = {
    userAgent: 'NodeJS',
};

import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { getServiceConfig } from '../../src/getServiceConfig';

const {
    COGNITO_REGION,
    COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID,
    COGNITO_USERNAME,
    COGNITO_PASSWORD,
} = getServiceConfig();

Amplify.configure({
    Auth: {
        region: COGNITO_REGION,
        userPoolId: COGNITO_USER_POOL_ID,
        userPoolWebClientId: COGNITO_APP_CLIENT_ID,
    },
});

export const getIdToken = async (): Promise<string> => {
    const cognitoUser = await Auth.signIn(COGNITO_USERNAME, COGNITO_PASSWORD);
    const { idToken } = cognitoUser.signInUserSession;
    return idToken.jwtToken;
};
