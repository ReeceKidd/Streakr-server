import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const registeredEmail = "search-user@gmail.com";
const registeredUsername = "search-user";

const searchableUserEmail = "other-user@gmail.com";
const searchableUserUsername = "other-user";

const searchQueryKey = "searchQuery";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe("/users", () => {
  beforeAll(async () => {
    await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    await request(server)
      .post(registrationRoute)
      .send({
        username: searchableUserUsername,
        email: searchableUserEmail
      });
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: registeredEmail });
    await userModel.deleteOne({ email: searchableUserEmail });
  });

  test(`that request returns searchAbleUser when full searchTerm is uaed`, async () => {
    expect.assertions(10);
    const getUsersByRegexSearchRouteWithSearchQueryRoute = `/${ApiVersions.v1}/${RouteCategories.users}?${searchQueryKey}=${searchableUserUsername}`;
    const response = await request(server).get(
      getUsersByRegexSearchRouteWithSearchQueryRoute
    );
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    const users = response.body.users;
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("role");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("username");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
  });

  test("that request returns searchAble user when partial searchTerm is used", async () => {
    expect.assertions(10);
    const partialSearchQuery = `${searchableUserUsername}`;
    const getUsersByRegexSearchWithPartialSearchQueryRoute = `/${ApiVersions.v1}/${RouteCategories.users}?${searchQueryKey}=${partialSearchQuery}`;
    const response = await request(server).get(
      getUsersByRegexSearchWithPartialSearchQueryRoute
    );
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    const users = response.body.users;
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("role");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("username");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
  });
});
