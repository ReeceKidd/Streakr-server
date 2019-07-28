import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

const registeredEmail = "stripe-subscription-user@gmail.com";
const registeredUsername = "stripe-subscription-user";
const secondRegisteredEmail = "second-stripe-subscription-user@gmail.com";
const secondRegisteredUsername = "second-registered-username";
const premiumEmail = "premium-email@gmail.com";
const premiumUsername = "premium-username";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const subscriptionsRoute = `/${ApiVersions.v1}/${RouteCategories.stripe}/subscriptions`;

jest.setTimeout(120000);

describe(`POST ${subscriptionsRoute}`, () => {
  let id = "";
  let secondId = "";
  let premiumId = "";

  const validToken = "tok_visa";

  beforeAll(async () => {
    const userResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    id = userResponse.body._id;
    const secondUserResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: secondRegisteredUsername,
        email: secondRegisteredEmail
      });
    secondId = secondUserResponse.body._id;
    const premiumUserResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: premiumUsername,
        email: premiumEmail
      });
    premiumId = premiumUserResponse.body._id;
    await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token: validToken,
        id: premiumId
      });
  });

  afterAll(async () => {
    await userModel.findByIdAndDelete(id);
    await userModel.findByIdAndDelete(secondId);
    await userModel.findByIdAndDelete(premiumId);
  });

  test("takes users payment and subscribes them", async () => {
    expect.assertions(5);
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token: validToken,
        id
      });
    expect(response.status).toEqual(201);
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.stripe.subscription).toBeDefined();
    expect(response.body.user.stripe.customer).toBeDefined();
    expect(response.body.user.type).toEqual("premium");
  });

  test("sends correct error when token is missing in request", async () => {
    expect.assertions(2);
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        id: secondId
      });
    expect(response.status).toEqual(422);
    expect(response.body.message).toEqual(
      'child "token" fails because ["token" is required]'
    );
  });

  test("sends correct error when id is missing in request", async () => {
    expect.assertions(2);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token
      });
    expect(response.status).toEqual(422);
    expect(response.body.message).toEqual(
      'child "id" fails because ["id" is required]'
    );
  });

  test("sends correct error when invalid token is sent", async () => {
    expect.assertions(2);
    const token = "any";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        id: secondId
      });
    expect(response.status).toEqual(500);
    expect(response.body.code).toEqual("500-45");
  });

  test("sends correct error when non Mongo ID is sent", async () => {
    expect.assertions(2);
    const token = "tok_visa";

    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        id: "invalid-id",
        token
      });

    expect(response.status).toEqual(500);
    expect(response.body.code).toEqual("500-44");
  });

  test("sends correct error when user does not exist", async () => {
    expect.assertions(3);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        id: "5d053a174c64143898b78455",
        token
      });
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual("400-11");
    expect(response.body.message).toEqual("User does not exist.");
  });

  test("sends correct error when user is already premium", async () => {
    expect.assertions(3);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        id: premiumId,
        token
      });
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual("400-12");
    expect(response.body.message).toEqual("User is already subscribed.");
  });
});
