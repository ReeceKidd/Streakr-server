import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import APPLICATION_URL from "../../config";

const registeredEmail = "delete-user@gmail.com";
const registeredUsername = "delete-user";

const usersRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe("DELETE /users/:userId", () => {
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

  test(`deletes user`, async () => {
    expect.assertions(3);

    const deleteUserResponse = await request(APPLICATION_URL).delete(
      `${usersRoute}/${userId}`
    );
    const getUserAfterDeletionResponse = await request(APPLICATION_URL).get(
      `${usersRoute}/${userId}`
    );

    expect(deleteUserResponse.status).toBe(204);
    expect(getUserAfterDeletionResponse.status).toBe(400);
    expect(getUserAfterDeletionResponse.body.message).toEqual(
      "User does not exist."
    );
  });

  test(`sends NoUserToDeleteFound error when user does not exist`, async () => {
    expect.assertions(2);

    const deleteUserResponse = await request(APPLICATION_URL).delete(
      `/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
    );
    expect(deleteUserResponse.status).toBe(400);
    expect(deleteUserResponse.body.message).toEqual("User does not exist.");
  });
});
