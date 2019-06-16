import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { soloStreakModel } from "../../../src/Models/SoloStreak";

import { AuthPaths } from "../../../src/Routers/authRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";

const registeredEmail = "patch-solo-streak-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = "patch-solo-streak-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const romeTimezone = "Europe/Rome";
const berlinTimeZone = "Europe/Berlin";


jest.setTimeout(120000);

describe(`PATCH ${soloStreakRoute}`, () => {

    let jsonWebToken: string;
    let userId: string;
    let soloStreakId: string;
    let updatedName: string;

    const name = "Keto";
    const description = "I will follow the keto diet every day";

    beforeAll(async () => {
        const registrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: registeredUserName,
                    email: registeredEmail,
                    password: registeredPassword
                }
            );
        userId = registrationResponse.body._id;
        const loginResponse = await request(server)
            .post(loginRoute)
            .send(
                {
                    email: registeredEmail,
                    password: registeredPassword
                }
            );
        jsonWebToken = loginResponse.body.jsonWebToken;
        const createSoloStreakResponse = await request(server)
            .post(soloStreakRoute)
            .send({
                userId,
                name,
                description
            })
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [SupportedRequestHeaders.xTimezone]: romeTimezone });
        soloStreakId = createSoloStreakResponse.body._id;
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail });
        await soloStreakModel.deleteOne({ name: updatedName });
    });

    test(`that request passes when solo streak is patched with correct keys`, async () => {
        expect.assertions(9);
        updatedName = "Intermittent fasting";
        const updatedDescription = "Cannot eat till 1pm everyday";
        const response = await request(server)
            .patch(`${soloStreakRoute}/${soloStreakId}`)
            .send({
                name: updatedName,
                description: updatedDescription
            })
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [SupportedRequestHeaders.xTimezone]: berlinTimeZone });
        expect(response.status).toEqual(ResponseCodes.success);
        expect(response.type).toEqual("application/json");
        expect(response.body.data.name).toEqual(updatedName);
        expect(response.body.data.description).toEqual(updatedDescription);
        expect(response.body.data.userId).toEqual(userId);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data.currentStreak).toHaveProperty("numberOfDaysInARow");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
    });

});
