import { getServiceConfig } from './getServiceConfig';

describe('getServiceConfig', () => {
    const environmentMock = {
        NODE_ENV: 'NODE_ENV',
        PORT: 'PORT',
        DATABASE_URI: 'DATABASE_URI',
        AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
        AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
        AWS_REGION: 'AWS_REGION',
        STRIPE_SECRET_KEY: 'STRIPE_SECRET_KEY',
        STRIPE_MONTHLY_PLAN: 'STRIPE_MONTHLY_PLAN',
        STRIPE_ANNUAL_PLAN: 'STRIPE_ANNUAL_PLAN',
        APPLICATION_URL: 'APPLICATION_URL',
        EMAIL_USER: 'EMAIL_USER',
        EMAIL_PASSWORD: 'EMAIL_PASSWORD',
        EMAIL_FROM: 'EMAIL_FROM',
        EMAIL_TO: 'EMAIL_TO',
        COGNITO_APP_CLIENT_ID: 'COGNITO_APP_CLIENT_ID',
        COGNITO_REGION: 'COGNITO_REGION',
        COGNITO_USER_POOL_ID: 'COGNITO_USER_POOL_ID',
        COGNITO_USERNAME: 'COGNITO_USERNAME',
        COGNITO_EMAIL: 'COGNITO_EMAIL',
        COGNITO_PASSWORD: 'COGNITO_PASSWORD',
        PROFILE_PICTURES_BUCKET: 'PROFILE_PICTURES_BUCKET',
        ANDROID_SNS_PLATFORM_APPLICATION_ARN: 'ANDROID_SNS_PLATFORM_APPLICATION_ARN',
        IOS_SNS_PLATFORM_APPLICATION_ARN: 'ANDROID_SNS_PLATFORM_APPLICATION_ARN',
        SNS_TOPIC_ARN: 'SNS_TOPIC_ARN',
        DEFAULT_USER_PROFILE_IMAGE_URL: 'DEFAULT_USER_PROFILE_IMAGE_URL',
    };

    test('that correct error is thrown when NODE_ENV is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            NODE_ENV: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('NODE_ENV is not provided.');
        }
    });

    test('that correct error is thrown when PORT is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            PORT: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('PORT is not provided.');
        }
    });

    test('that correct error is thrown when DATABASE_URI is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            DATABASE_URI: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('DATABASE_URI is not provided.');
        }
    });

    test('that correct error is thrown when AWS_ACCESS_KEY_ID is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_ACCESS_KEY_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_ACCESS_KEY_ID is not provided.');
        }
    });

    test('that correct error is thrown when AWS_SECRET_ACCESS_KEY is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_SECRET_ACCESS_KEY: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_SECRET_ACCESS_KEY is not provided.');
        }
    });

    test('that correct error is thrown when AWS_REGION is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_REGION: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_REGION is not provided.');
        }
    });

    test('that correct error is thrown when STRIPE_SECRET_KEY is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            STRIPE_SECRET_KEY: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('STRIPE_SECRET_KEY is not provided.');
        }
    });

    test('that correct error is thrown when STRIPE_MONTHLY_PLAN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            STRIPE_MONTHLY_PLAN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('STRIPE_MONTHLY_PLAN is not provided.');
        }
    });

    test('that correct error is thrown when STRIPE_ANNUAL_PLAN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            STRIPE_ANNUAL_PLAN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('STRIPE_ANNUAL_PLAN is not provided.');
        }
    });

    test('that correct error is thrown when APPLICATION_URL is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            APPLICATION_URL: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('APPLICATION_URL is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_USER is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_USER: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_USER is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_PASSWORD is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_PASSWORD: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_PASSWORD is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_FROM is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_FROM: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_FROM is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_TO is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_TO: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_TO is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_APP_CLIENT_ID is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_APP_CLIENT_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNTIO_APP_CLIENT_ID is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_REGION is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_REGION: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNTIO_REGION is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_USER_POOL_ID is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_USER_POOL_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_USER_POOL_ID is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_USERNAME is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_USERNAME: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_USERNAME is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_EMAIL is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_EMAIL: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_EMAIL is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_PASSWORD is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_PASSWORD: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_PASSWORD is not provided.');
        }
    });

    test('that correct error is thrown when PROFILE_PICTURES_BUCKET is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            PROFILE_PICTURES_BUCKET: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('PROFILE_PICTURES_BUCKET is not provided.');
        }
    });

    test('that correct error is thrown when ANDROID_SNS_PLATFORM_APPLICATION_ARN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            ANDROID_SNS_PLATFORM_APPLICATION_ARN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('ANDROID_SNS_PLATFORM_APPLICATION_ARN is not provided.');
        }
    });

    test('that correct error is thrown when IOS_SNS_PLATFORM_APPLICATION_ARN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            IOS_SNS_PLATFORM_APPLICATION_ARN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('IOS_SNS_PLATFORM_APPLICATION_ARN is not provided.');
        }
    });

    test('that correct error is thrown when SNS_TOPIC_ARN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            SNS_TOPIC_ARN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('SNS_TOPIC_ARN is not provided.');
        }
    });

    test('that correct error is thrown when DEFAULT_USER_PROFILE_IMAGE_URL is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            DEFAULT_USER_PROFILE_IMAGE_URL: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('DEFAULT_USER_PROFILE_IMAGE_URL is not provided.');
        }
    });
});
