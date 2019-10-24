import dotenv from 'dotenv';
dotenv.config();

export interface AppConfigHttp {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URI: string;
    TEST_DATABASE_URI: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PLAN: string;
    APPLICATION_URL: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    EMAIL_FROM: string;
    EMAIL_TO: string;
    COGNITO_APP_CLIENT_ID: string;
    COGNITO_REGION: string;
    COGNITO_USER_POOL_ID: string;
    COGNITO_USERNAME: string;
    COGNITO_EMAIL: string;
    COGNITO_PASSWORD: string;
    PROFILE_PICTURES_BUCKET: string;
}

export type AppConfig = AppConfigHttp;

export const getServiceConfig = (environment: NodeJS.ProcessEnv = process.env): AppConfig => {
    const {
        NODE_ENV,
        PORT,
        DATABASE_URI,
        TEST_DATABASE_URI,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_REGION,
        STRIPE_SECRET_KEY,
        STRIPE_PLAN,
        APPLICATION_URL,
        EMAIL_USER,
        EMAIL_PASSWORD,
        EMAIL_FROM,
        EMAIL_TO,
        COGNITO_APP_CLIENT_ID,
        COGNITO_REGION,
        COGNITO_USER_POOL_ID,
        COGNITO_USERNAME,
        COGNITO_EMAIL,
        COGNITO_PASSWORD,
        PROFILE_PICTURES_BUCKET,
    } = environment;

    if (!NODE_ENV) throw new Error('NODE_ENV is not provided.');

    if (!PORT) throw new Error('PORT is not provided.');

    if (!DATABASE_URI) throw new Error('DATABASE_URI is not provided.');

    if (!TEST_DATABASE_URI) throw new Error('TEST_DATABASE_URI is not provided.');

    if (!AWS_ACCESS_KEY_ID) {
        throw new Error('AWS_ACCESS_KEY_ID is not provided.');
    }

    if (!AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS_SECRET_ACCESS_KEY is not provided.');
    }

    if (!AWS_REGION) {
        throw new Error('AWS_REGION is not provided.');
    }

    if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not provided.');
    }

    if (!STRIPE_PLAN) {
        throw new Error('STRIPE_PLAN is not provided.');
    }

    if (!APPLICATION_URL) {
        throw new Error('APPLICATION_URL is not provided.');
    }

    if (!EMAIL_USER) {
        throw new Error('EMAIL_USER is not provided.');
    }

    if (!EMAIL_PASSWORD) {
        throw new Error('EMAIL_PASSWORD is not provided.');
    }

    if (!EMAIL_FROM) {
        throw new Error('EMAIL_FROM is not provided.');
    }

    if (!EMAIL_TO) {
        throw new Error('EMAIL_TO is not provided.');
    }

    if (!COGNITO_APP_CLIENT_ID) {
        throw new Error('COGNTIO_APP_CLIENT_ID is not provided.');
    }

    if (!COGNITO_REGION) {
        throw new Error('COGNTIO_REGION is not provided.');
    }

    if (!COGNITO_USER_POOL_ID) {
        throw new Error('COGNITO_USER_POOL_ID is not provided.');
    }

    if (!COGNITO_USERNAME) {
        throw new Error('COGNITO_USERNAME is not provided.');
    }

    if (!COGNITO_EMAIL) {
        throw new Error('COGNITO_EMAIL is not provided.');
    }

    if (!COGNITO_PASSWORD) {
        throw new Error('COGNITO_PASSWORD is not provided.');
    }

    if (!PROFILE_PICTURES_BUCKET) {
        throw new Error('PROFILE_PICTURES_BUCKET is not provided.');
    }

    return {
        NODE_ENV,
        PORT,
        DATABASE_URI,
        TEST_DATABASE_URI,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_REGION,
        STRIPE_SECRET_KEY,
        STRIPE_PLAN,
        APPLICATION_URL,
        EMAIL_USER,
        EMAIL_PASSWORD,
        EMAIL_FROM,
        EMAIL_TO,
        COGNITO_APP_CLIENT_ID,
        COGNITO_REGION,
        COGNITO_USER_POOL_ID,
        COGNITO_USERNAME,
        COGNITO_EMAIL,
        COGNITO_PASSWORD,
        PROFILE_PICTURES_BUCKET,
    } as AppConfigHttp;
};
