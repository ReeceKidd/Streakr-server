import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import APPLICATION_URL from "../../config";
import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-user@gmail.com";
const registeredUsername = "delete-user";

const usersRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe("DELETE /users/:userId", () => {
  let userId = "";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
  });

  test(`deletes user`, async () => {
    expect.assertions(3);

    try {
      const deleteUserResponse = await streakoid.users.deleteOne(userId);
      expect(deleteUserResponse.status).toBe(204);
      await streakoid.users.getOne(userId);
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.message).toEqual("User does not exist.");
    }
  });

  test(`sends NoUserToDeleteFound error when user does not exist`, async () => {
    expect.assertions(2);

    try {
      await streakoid.users.deleteOne(userId);
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.message).toEqual("User does not exist.");
    }
  });
});
