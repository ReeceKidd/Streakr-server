import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";

import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";

const registeredEmail = "delete-solo-streak-user@gmail.com";
const registeredUsername = "delete-solo-streak-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const budapestTimezone = "Europe/Budapest";

jest.setTimeout(120000);

describe(`DELETE ${soloStreakRoute}`, () => {
  let userId: string;
  let soloStreakId: string;

  const name = "Reading";
  const description = "I will read 30 minutes every day";

  beforeAll(async () => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;

    const createSoloStreakResponse = await request(server)
      .post(soloStreakRoute)
      .send({
        userId,
        name,
        description
      })
      .set({ [SupportedRequestHeaders.xTimezone]: budapestTimezone });
    soloStreakId = createSoloStreakResponse.body._id;
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: registeredEmail });
  });

  test(`that solo streak can be deleted`, async () => {
    expect.assertions(1);
    const deleteSoloStreakRoute = `${soloStreakRoute}/${soloStreakId}`;

    const response = await request(server).delete(deleteSoloStreakRoute);

    expect(response.status).toEqual(ResponseCodes.deleted);
  });
});
