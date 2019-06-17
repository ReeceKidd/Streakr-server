import { getServiceConfig } from "./getServiceConfig";

describe("getServiceConfig", () => {
  const environmentMock = {
    DATABASE_URI: "DATABASE_URI",
    PATH_TO_JWT_PRIVATE_KEY: "PATH_TO_JWT_PRIVATE_KEY",
    PATH_TO_JWT_PUBLIC_KEY: "PATH_TO_JWT_PUBLIC_KEY",
    PORT: "PORT"
  };
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

  test("that correct error is thrown when PATH_TO_JWT_PRIVATE_KEY is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      PATH_TO_JWT_PRIVATE_KEY: undefined
    };
    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("PATH_TO_JWT_PRIVATE_KEY is not provided.");
    }
  });

  test("that correct error is thrown when PATH_TO_JWT_PUBLIC_KEY is not provided", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      PATH_TO_JWT_PUBLIC_KEY: undefined
    };
    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("PATH_TO_JWT_PUBLIC_KEY is not provided.");
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
});
