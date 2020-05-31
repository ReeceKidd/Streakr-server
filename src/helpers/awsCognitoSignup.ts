/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import fetch from 'node-fetch';
import { getServiceConfig } from '../getServiceConfig';
(global as any).fetch = fetch;

export const awsCognitoSignup = ({ username, password }: { username: string; password: string }) => {
    const poolData = {
        UserPoolId: getServiceConfig().COGNITO_USER_POOL_ID,
        ClientId: getServiceConfig().COGNITO_APP_CLIENT_ID,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    return new Promise((resolve, reject) => {
        userPool.signUp(
            username,
            password,
            [],
            [],
            (err: Error | undefined, result: AmazonCognitoIdentity.ISignUpResult | undefined) => {
                if (err) return reject(err);
                return resolve(result);
            },
        );
    });
};
