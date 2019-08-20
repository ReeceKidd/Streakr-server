import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "stripe-subscription-user@gmail.com";
const registeredUsername = "stripe-subscription-user";
const secondRegisteredEmail = "second-stripe-subscription-user@gmail.com";
const secondRegisteredUsername = "second-registered-username";
const premiumEmail = "premium-email@gmail.com";
const premiumUsername = "premium-username";

jest.setTimeout(120000);

describe(`POST /subscriptions`, () => {
  let id = "";
  let secondId = "";
  let premiumId = "";

  const validToken = "tok_visa";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    id = registrationResponse.data._id;

    const secondRegistrationResponse = await streakoid.users.create(
      secondRegisteredUsername,
      secondRegisteredEmail
    );
    secondId = secondRegistrationResponse.data._id;

    const premiumUserResponse = await streakoid.users.create(
      premiumUsername,
      premiumEmail
    );
    premiumId = premiumUserResponse.data._id;

    await streakoid.stripe.createSubscription(validToken, premiumId);
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(id);
    await streakoid.users.deleteOne(secondId);
    await streakoid.users.deleteOne(premiumId);
  });

  test("takes users payment and subscribes them", async () => {
    expect.assertions(5);

    const response = await streakoid.stripe.createSubscription(validToken, id);

    expect(response.status).toEqual(201);
    expect(response.data.user._id).toBeDefined();
    expect(response.data.user.stripe.subscription).toBeDefined();
    expect(response.data.user.stripe.customer).toBeDefined();
    expect(response.data.user.type).toEqual("premium");
  });

  test("sends correct error when token is missing in request", async () => {
    expect.assertions(2);

    try {
      await streakoid.stripe.createSubscription(undefined as any, secondId);
    } catch (err) {
      expect(err.response.status).toEqual(422);
      expect(err.response.data.message).toEqual(
        'child "token" fails because ["token" is required]'
      );
    }
  });

  test("sends correct error when id is missing in request", async () => {
    expect.assertions(2);

    try {
      const token = "tok_visa";
      await streakoid.stripe.createSubscription(token, undefined as any);
    } catch (err) {
      expect(err.response.status).toEqual(422);
      expect(err.response.data.message).toEqual(
        'child "id" fails because ["id" is required]'
      );
    }
  });

  test("sends correct error when non Mongo ID is sent", async () => {
    expect.assertions(2);

    try {
      const token = "tok_visa";
      await streakoid.stripe.createSubscription(token, "invalid-id");
    } catch (err) {
      expect(err.response.status).toEqual(500);
      expect(err.response.data.code).toEqual("500-44");
    }
  });

  test("sends correct error when user does not exist", async () => {
    expect.assertions(3);

    try {
      const token = "tok_visa";
      await streakoid.stripe.createSubscription(
        token,
        "5d053a174c64143898b78455"
      );
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.code).toEqual("400-11");
      expect(err.response.data.message).toEqual("User does not exist.");
    }
  });

  test("sends correct error when user is already premium", async () => {
    expect.assertions(3);
    const token = "tok_visa";

    try {
      await streakoid.stripe.createSubscription(token, premiumId);
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.code).toEqual("400-12");
      expect(err.response.data.message).toEqual("User is already subscribed.");
    }
  });
});
