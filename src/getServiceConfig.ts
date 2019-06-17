export interface AppConfigHttp {
  DATABASE_URI: string;
  PATH_TO_JWT_PRIVATE_KEY: string;
  PATH_TO_JWT_PUBLIC_KEY: string;
  PORT: string;
}

export type AppConfig = AppConfigHttp;

import dotenv from "dotenv";
dotenv.config();

export const getServiceConfig = (
  environment: NodeJS.ProcessEnv = process.env
): AppConfig => {
  const {
    DATABASE_URI,
    PATH_TO_JWT_PRIVATE_KEY,
    PATH_TO_JWT_PUBLIC_KEY,
    PORT
  } = environment;

  if (!DATABASE_URI) throw new Error("DATABASE_URL is not provided.");

  if (!PATH_TO_JWT_PRIVATE_KEY) {
    throw new Error("PATH_TO_JWT_PRIVATE_KEY is not provided.");
  }

  if (!PATH_TO_JWT_PUBLIC_KEY) {
    throw new Error("PATH_TO_JWT_PUBLIC_KEY is not provided.");
  }

  if (!PORT) throw new Error("PORT is not provided.");

  return {
    DATABASE_URI,
    PATH_TO_JWT_PRIVATE_KEY,
    PATH_TO_JWT_PUBLIC_KEY,
    PORT
  };
};
