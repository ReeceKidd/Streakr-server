import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

const registeredEmail = "stripe-subscription-delete@gmail.com";
const registeredUsername = "stripe-subscription-delete";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const subscriptionsRoute = `/${ApiVersions.v1}/${RouteCategories.stripe}/subscriptions`;

jest.setTimeout(120000);

describe(`DELETE ${subscriptionsRoute}`, () => {
  let subscription = "";
  let id = "";

  beforeAll(async () => {
    const userResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    id = userResponse.body._id;
    console.log(id);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        email: registeredEmail
      });
    console.log(response.body);
    subscription = response.body.subscription;
  });

  afterAll(async () => {
    await userModel.findByIdAndDelete(id);
  });

  test("unsubscribes user", async () => {
    expect.assertions(2);
    console.log(`Subscription: ${subscription}`);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id,
        subscription
      });
    expect(response.status).toEqual(204);
    const updatedUser: any = await userModel.findOne({
      email: registeredEmail
    });
    expect(updatedUser.type).toEqual("basic");
  });
});
