import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import APPLICATION_URL from "../../config";

const registeredEmail = "get-user@gmail.com";
const registeredUsername = "get-user";

const usersRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe("GET /users/:userId", () => {
  let userId = "";

  beforeAll(async () => {
    const registrationResponse = await request(APPLICATION_URL)
      .post(usersRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;
  });

  afterAll(async () => {
    await request(APPLICATION_URL).delete(`${usersRoute}/${userId}`);
  });

  test(`retreives user`, async () => {
    expect.assertions(3);

    const getUserResponse = await request(APPLICATION_URL).get(
      `${usersRoute}/${userId}`
    );

    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body.user.email).toEqual(registeredEmail);
    expect(getUserResponse.body.user.username).toEqual(registeredUsername);
  });

  test(`sends NoUserFound error when userId is not valid`, async () => {
    expect.assertions(3);

    const getUserResponse = await request(APPLICATION_URL).get(
      `${usersRoute}/invalid`
    );

    expect(getUserResponse.status).toBe(400);
    expect(getUserResponse.body.message).toEqual("User does not exist");
  });
});
