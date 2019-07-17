export interface AppConfigHttp {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URI: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  STRIPE_SHAREABLE_KEY: string;
  STRIPE_PRODUCT: string;
}

export type AppConfig = AppConfigHttp;

import dotenv from "dotenv";
dotenv.config();

export const getServiceConfig = (
  environment: NodeJS.ProcessEnv = process.env
): AppConfig => {
  const {
    NODE_ENV,
    PORT,
    DATABASE_URI,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    STRIPE_SHAREABLE_KEY,
    STRIPE_PRODUCT
  } = environment;

  if (!NODE_ENV) throw new Error("NODE_ENV is not provided.");

  if (!PORT) throw new Error("PORT is not provided.");

  if (!DATABASE_URI) throw new Error("DATABASE_URL is not provided.");

  if (!AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is not provided.");
  }

  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not provided.");
  }

  if (!AWS_REGION) {
    throw new Error("AWS_REGION is not provided.");
  }

  if (!STRIPE_SHAREABLE_KEY) {
    throw new Error("STRIPE_SHAREABLE_KEY is not provided.");
  }

  if (!STRIPE_PRODUCT) {
    throw new Error("STRIPE_PRODUCT is not provided.");
  }

  return {
    NODE_ENV,
    PORT,
    DATABASE_URI,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    STRIPE_SHAREABLE_KEY,
    STRIPE_PRODUCT
  };
};
