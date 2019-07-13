import { getServiceConfig } from "./getServiceConfig";

describe("getServiceConfig", () => {
  const environmentMock = {
    NODE_ENV: "NODE_ENV",
    PORT: "PORT",
    DATABASE_URI: "DATABASE_URI",
    AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID",
    AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY",
    AWS_REGION: "AWS_REGION"
  };

  test("that correct error is thrown when NODE_ENV is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      NODE_ENV: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("NODE_ENV is not provided.");
    }
  });

  test("that correct error is thrown when PORT is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      PORT: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("PORT is not provided.");
    }
  });

  test("that correct error is thrown when DATABASE_URI is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      DATABASE_URI: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("DATABASE_URL is not provided.");
    }
  });

  test("that correct error is thrown when AWS_ACCESS_KEY_ID is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      AWS_ACCESS_KEY_ID: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("AWS_ACCESS_KEY_ID is not provided.");
    }
  });

  test("that correct error is thrown when AWS_SECRET_ACCESS_KEY is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      AWS_SECRET_ACCESS_KEY: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("AWS_SECRET_ACCESS_KEY is not provided.");
    }
  });

  test("that correct error is thrown when AWS_REGION is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      AWS_REGION: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("AWS_REGION is not provided.");
    }
  });
});
