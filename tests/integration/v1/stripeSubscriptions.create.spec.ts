import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

const registeredEmail = "stripe-subscription-user@gmail.com";
const registeredFailureEmail = "stripe-subscription-failure@gmail.com";
const registeredUsername = "stripe-subscription-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const subscriptionsRoute = `/${ApiVersions.v1}/${RouteCategories.stripe}/subscriptions`;

jest.setTimeout(120000);

describe(`POST ${subscriptionsRoute}`, () => {
  beforeAll(async () => {
    await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: registeredEmail });
    await userModel.deleteOne({ email: registeredFailureEmail });
  });

  test("takes users payment and subscribes them", async () => {
    expect.assertions(3);
    const token = "tok_visa";
    const email = registeredEmail;
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        email
      });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("stripeCustomer");
    expect(response.body).toHaveProperty("subscription");
  });

  test("sends correct error when invalid data is sent", async () => {
    expect.assertions(2);
    const token = "any";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        email: registeredFailureEmail
      });
    expect(response.status).toEqual(500);
    expect(response.body.code).toEqual("500-45");
  });
});
