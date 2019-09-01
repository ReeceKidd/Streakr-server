import { getServiceConfig } from "./getServiceConfig";

describe("getServiceConfig", () => {
  const environmentMock = {
    NODE_ENV: "NODE_ENV",
    PORT: "PORT",
    DATABASE_URI: "DATABASE_URI",
    AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID",
    AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY",
    AWS_REGION: "AWS_REGION",
    STRIPE_SHAREABLE_KEY: "STRIPE_SHAREABLE_KEY",
    STRIPE_PLAN: "STRIPE_PLAN",
    APPLICATION_URL: "APPLICATION_URL"
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

  test("that correct error is thrown when STRIPE_SHAREABLE_KEY is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      STRIPE_SHAREABLE_KEY: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("STRIPE_SHAREABLE_KEY is not provided.");
    }
  });

  test("that correct error is thrown when STRIPE_PLAN is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      STRIPE_PLAN: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("STRIPE_PLAN is not provided.");
    }
  });

  test("that correct error is thrown when APPLICATION_URL is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      APPLICATION_URL: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual("APPLICATION_URL is not provided.");
    }
  });

  test("that correct error is thrown when AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual(
        "AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL is not provided."
      );
    }
  });

  test("that correct error is thrown when AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_TIME_RANGE is not provided.", () => {
    expect.assertions(1);
    const environment = {
      ...environmentMock,
      AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_TIME_RANGE: undefined
    };

    try {
      getServiceConfig(environment);
    } catch (err) {
      expect(err.message).toEqual(
        "AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_TIME_RANGE is not provided."
      );
    }
  });
});
