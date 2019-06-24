import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { soloStreakModel } from "../../../src/Models/SoloStreak";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";

const registeredEmail = "get-solo-streaks@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = "get-solo-streaks-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;
const getSoloStreaksRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const soloStreakName = "Daily Spanish";
const soloStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const parisTimezone = "Europe/Paris";

jest.setTimeout(120000);

describe(getSoloStreaksRoute, () => {
  let jsonWebToken: string;
  let userId: string;

  beforeAll(async done => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        userName: registeredUserName,
        email: registeredEmail,
        password: registeredPassword
      });
    userId = registrationResponse.body._id;
    const loginResponse = await request(server)
      .post(loginRoute)
      .send({
        email: registeredEmail,
        password: registeredPassword
      });
    jsonWebToken = loginResponse.body.jsonWebToken;
    await request(server)
      .post(createSoloStreakRoute)
      .send({
        userId,
        name: soloStreakName,
        description: soloStreakDescription
      })
      .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
      .set({ [SupportedRequestHeaders.xTimezone]: parisTimezone });
    done();
  });

  afterAll(async done => {
    await userModel.deleteOne({ email: registeredEmail });
    await soloStreakModel.deleteOne({ name: soloStreakName });
    done();
  });

  test(`that solo streaks can be retreived for user`, async done => {
    expect.assertions(9);
    const getSoloStreaksRouteWithQueryParamater = `${getSoloStreaksRoute}?userId=${userId}`;
    const response = await request(server)
      .get(getSoloStreaksRouteWithQueryParamater)
      .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken });
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    expect(response.body.soloStreaks.length).toEqual(1);
    expect(response.body.soloStreaks[0].name).toEqual(soloStreakName);
    expect(response.body.soloStreaks[0].description).toEqual(
      soloStreakDescription
    );
    expect(response.body.soloStreaks[0].userId).toEqual(userId);
    expect(response.body.soloStreaks[0]).toHaveProperty("_id");
    expect(response.body.soloStreaks[0]).toHaveProperty("createdAt");
    expect(response.body.soloStreaks[0]).toHaveProperty("updatedAt");
    done();
  });
});
