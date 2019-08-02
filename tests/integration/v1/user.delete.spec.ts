import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import APPLICATION_URL from "../../config";

const registeredEmail = "search-user@gmail.com";
const registeredUsername = "search-user";

const searchableUserEmail = "other-user@gmail.com";
const searchableUserUsername = "other-user-username";

const searchQueryKey = "searchQuery";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe("DELETE /users/:userId", () => {
  let userId = "";

  beforeAll(async () => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;
  });

  test(`deletes user`, async () => {
    expect.assertions(3);

    const deleteUserResponse = await request(APPLICATION_URL).delete(
      `/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
    );
    const getUserAfterDeletionResponse = await request(APPLICATION_URL).get(
      `/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
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
