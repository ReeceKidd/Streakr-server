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
    console.log(`user id: ${id}`);
    const token = "tok_visa";
    const response = await request(server)
      .post(`${subscriptionsRoute}`)
      .send({
        token,
        id
      });
    subscription = response.body.subscription;
    console.log(response.body);
    console.log(`Subscription ${subscription}`);
  });

  afterAll(async () => {
    console.log(`DELETE: ${id}`);
    await userModel.findByIdAndDelete(id);
  });

  test("unsubscribes user", async () => {
    expect.assertions(2);
    const response = await request(server)
      .delete(`${subscriptionsRoute}`)
      .send({
        id,
        subscription
      });
    console.log(response.body);
    expect(response.status).toEqual(204);
    console.log("GOT HERE");
    const updatedUser: any = await userModel.findById(id);
    console.log(updatedUser);
    expect(updatedUser.type).toEqual("basic");
    expect(updatedUser.stripe.subscription).toEqual(false);
  });
});
