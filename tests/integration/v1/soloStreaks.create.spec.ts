import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { soloStreakModel } from "../../../src/Models/SoloStreak";

import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";

const registeredEmail = "create-solo-streak-user@gmail.com";
const registeredUsername = "create-solo-streak-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe(createSoloStreakRoute, () => {
  let userId: string;

  const name = "Keto";
  const description = "I will follow the keto diet every day";

  beforeAll(async done => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;
    done();
  });

  afterAll(async done => {
    await userModel.deleteOne({ email: registeredEmail });
    await soloStreakModel.deleteOne({ name });
    done();
  });

  test(`that request passes when correct solo streak information is passed`, async () => {
    expect.assertions(9);
    const response = await request(server)
      .post(createSoloStreakRoute)
      .send({
        userId,
        name,
        description
      })
      .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
    expect(response.status).toEqual(ResponseCodes.created);
    expect(response.type).toEqual("application/json");
    expect(response.body.name).toEqual(name);
    expect(response.body.description).toEqual(description);
    expect(response.body.userId).toEqual(userId);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.currentStreak).toHaveProperty("numberOfDaysInARow");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });
});
