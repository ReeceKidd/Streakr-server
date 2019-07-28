import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

const registeredEmail = "stripe-subscription-delete@gmail.com";
const registeredUsername = "stripe-subscription-delete";
const basicUserEmail = "basic-subscription-user@gmail.com";
const basicUserUsername = "basic-subscription-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const subscriptionsRoute = `/${ApiVersions.v1}/${RouteCategories.stripe}/subscriptions`;

jest.setTimeout(120000);

describe(`DELETE ${subscriptionsRoute}`, () => {
  let subscription = "";
  let id = "";
  let basicUserId = "";

  beforeAll(async () => {
    const userResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    id = userResponse.body._id;
    const token = "tok_visa";
    const subscribeUserResponse = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        id
      });
    subscription = subscribeUserResponse.body.user.stripe.subscription;
    const basicUserResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: basicUserUsername,
        email: basicUserEmail
      });
    basicUserId = basicUserResponse.body._id;
  });

  afterAll(async () => {
    await userModel.findByIdAndDelete(id);
    await userModel.findByIdAndDelete(basicUserId);
  });

  test("unsubscribes user and changes user type to basic", async () => {
    expect.assertions(3);

    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id,
        subscription
      });
    const updatedUser: any = await userModel.findById(id);

    expect(response.status).toEqual(204);
    expect(updatedUser.type).toEqual("basic");
    expect(updatedUser.stripe.subscription).toEqual(null);
  });

  test("sends correct error when subscription is missing in request", async () => {
    expect.assertions(2);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id
      });
    expect(response.status).toEqual(422);
    expect(response.body.message).toEqual(
      'child "subscription" fails because ["subscription" is required]'
    );
  });

  test("sends correct error when id is missing in request", async () => {
    expect.assertions(2);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        subscription
      });
    expect(response.status).toEqual(422);
    expect(response.body.message).toEqual(
      'child "id" fails because ["id" is required]'
    );
  });

  test("sends correct error when user does not exist", async () => {
    expect.assertions(3);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id: "5d053a174c64143898b78455",
        subscription
      });
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual("400-13");
    expect(response.body.message).toEqual("User does not exist.");
  });

  test("sends correct error when user is not subscribed", async () => {
    expect.assertions(3);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id: basicUserId,
        subscription
      });
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual("400-14");
    expect(response.body.message).toEqual("Customer is not subscribed.");
  });
});
