import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

const registeredEmail = "stripe-subscription-user@gmail.com";
const registeredUsername = "stripe-subscription-user";
const secondRegisteredEmail = "second-stripe-subscription-user@gmail.com";
const secondRegisteredUsername = "second-registered-username";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const subscriptionsRoute = `/${ApiVersions.v1}/${RouteCategories.stripe}/subscriptions`;

jest.setTimeout(120000);

describe(`POST ${subscriptionsRoute}`, () => {
  let id = "";
  let secondId = "";

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
  });

  afterAll(async () => {
    await userModel.findByIdAndDelete(id);
    await userModel.findByIdAndDelete(secondId);
  });

  test("takes users payment and subscribes them", async () => {
    expect.assertions(5);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        id
      });
    expect(response.status).toEqual(201);
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.stripe.subscription).toBeDefined();
    expect(response.body.user.stripe.customer).toBeDefined();
    expect(response.body.user.type).toEqual("premium");
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
});
