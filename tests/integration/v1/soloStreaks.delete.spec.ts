import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-solo-streak-user@gmail.com";
const registeredUsername = "delete-solo-streak-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const budapestTimezone = "Europe/Budapest";

jest.setTimeout(120000);

describe(`DELETE solo-streaks`, () => {
  let userId: string;
  let soloStreakId: string;

  const name = "Reading";
  const description = "I will read 30 minutes every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      budapestTimezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`that solo streak can be deleted`, async () => {
    expect.assertions(1);

    const response = await streakoid.soloStreaks.deleteOne(soloStreakId);

    expect(response.status).toEqual(ResponseCodes.deleted);
  });
});
