import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "stripe-subscription-delete@gmail.com";
const registeredUsername = "stripe-subscription-delete";
const basicUserEmail = "basic-subscription-user@gmail.com";
const basicUserUsername = "basic-subscription-user";

jest.setTimeout(120000);

describe(`DELETE /subscriptions`, () => {
  let subscription = "";
  let id = "";
  let basicUserId = "";

  beforeAll(async () => {
    const userResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    id = userResponse.data._id;

    const token = "tok_visa";
    const subscribeUserResponse = await streakoid.stripe.createSubscription(
      token,
      id
    );
    subscription = subscribeUserResponse.data.user.stripe.subscription;

    const basicUserResponse = await streakoid.users.create(
      basicUserUsername,
      basicUserEmail
    );
    basicUserId = basicUserResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(id);
    await streakoid.users.deleteOne(basicUserId);
  });

  test("unsubscribes user and changes user type to basic", async () => {
    expect.assertions(3);

    const response = await streakoid.stripe.deleteSubscription(
      subscription,
      id
    );

    const updatedUserResponse = await streakoid.users.getOne(id);

    expect(response.status).toEqual(204);
    expect(updatedUserResponse.data.user.type).toEqual("basic");
    expect(updatedUserResponse.data.user.stripe.subscription).toEqual(null);
  });

  test("sends correct error when subscription is missing in request", async () => {
    expect.assertions(2);

    try {
      await streakoid.stripe.deleteSubscription(undefined as any, id);
    } catch (err) {
      expect(err.response.status).toEqual(422);
      expect(err.response.data.message).toEqual(
        'child "subscription" fails because ["subscription" is required]'
      );
    }
  });

  test("sends correct error when id is missing in request", async () => {
    expect.assertions(2);

    try {
      await streakoid.stripe.deleteSubscription(subscription, undefined as any);
    } catch (err) {
      expect(err.response.status).toEqual(422);
      expect(err.response.data.message).toEqual(
        'child "id" fails because ["id" is required]'
      );
    }
  });

  test("sends correct error when user does not exist", async () => {
    expect.assertions(3);

    try {
      await streakoid.stripe.deleteSubscription(
        subscription,
        "5d053a174c64143898b78455"
      );
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.code).toEqual("400-13");
      expect(err.response.data.message).toEqual("User does not exist.");
    }
  });

  test("sends correct error when user is not subscribed", async () => {
    expect.assertions(3);

    try {
      await streakoid.stripe.deleteSubscription(subscription, basicUserId);
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.code).toEqual("400-14");
      expect(err.response.data.message).toEqual("Customer is not subscribed.");
    }
  });
});
