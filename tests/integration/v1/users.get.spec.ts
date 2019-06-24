import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const registeredEmail = "search-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = "search-user";

const searchableUserEmail = "other-user@gmail.com";
const searchableUserPassword = "12345678";
const searchableUserUserName = "other-user";

const searchQueryKey = "searchQuery";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;

jest.setTimeout(120000);

describe("/users", () => {
  let jsonWebToken: string;

  beforeAll(async done => {
    await request(server)
      .post(registrationRoute)
      .send({
        userName: registeredUserName,
        email: registeredEmail,
        password: registeredPassword
      });

    const loginResponse = await request(server)
      .post(loginRoute)
      .send({
        email: registeredEmail,
        password: registeredPassword
      });

    jsonWebToken = loginResponse.body.jsonWebToken;
    await request(server)
      .post(registrationRoute)
      .send({
        userName: searchableUserUserName,
        email: searchableUserEmail,
        password: searchableUserPassword
      });
    done();
  });

  afterAll(async done => {
    await userModel.deleteOne({ email: registeredEmail });
    await userModel.deleteOne({ email: searchableUserEmail });
    done();
  });

  test(`that request returns searchAbleUser when full searchTerm is uaed`, async done => {
    expect.assertions(10);
    const getUsersByRegexSearchRouteWithSearchQueryRoute = `/${ApiVersions.v1}/${RouteCategories.users}?${searchQueryKey}=${searchableUserUserName}`;
    const response = await request(server)
      .get(getUsersByRegexSearchRouteWithSearchQueryRoute)
      .set({ "x-access-token": jsonWebToken });
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    const users = response.body.users;
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("role");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("userName");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
    done();
  });

  test("that request returns searchAble user when partial searchTerm is used", async done => {
    expect.assertions(10);
    const partialSearchQuery = `${searchableUserUserName[0]}${searchableUserUserName[1]}${searchableUserUserName[2]}`;
    const getUsersByRegexSearchWithPartialSearchQueryRoute = `/${ApiVersions.v1}/${RouteCategories.users}?${searchQueryKey}=${partialSearchQuery}`;
    const response = await request(server)
      .get(getUsersByRegexSearchWithPartialSearchQueryRoute)
      .set({ "x-access-token": jsonWebToken });
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    const users = response.body.users;
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("role");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("userName");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
    done();
  });
});
