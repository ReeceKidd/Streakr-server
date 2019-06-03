import request from "supertest";

import server from "../../../src/app";
import { ApiVersions } from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { TestPaths } from "../../../src/Routers/testRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { SupportedRequestHeaders } from "../../../src/Server/headers";

const registeredEmail = "jsonwebtoken@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = "json-web-token-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const verifyJsonWebTokenRoute = `/${ApiVersions.v1}/${RouteCategories.test}/${TestPaths.verifyJsonWebToken}`;

jest.setTimeout(60000);

describe(verifyJsonWebTokenRoute, () => {

    let jsonWebToken: string;

    beforeAll(async () => {
        await request(server).post(registrationRoute).send(
            {
                userName: registeredUserName,
                email: registeredEmail,
                password: registeredPassword
            }
        );
        const loginResponse = await request(server).post(loginRoute).send(
            {
                email: registeredEmail,
                password: registeredPassword
            }
        );
        jsonWebToken = loginResponse.body.jsonWebToken;
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail });
    });

    test(`that request passes when json web token is valid`, async () => {
        expect.assertions(3);
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken });
        expect(response.status).toEqual(ResponseCodes.success);
        expect(response.body.auth).toBe(true);
        expect(response.type).toEqual("application/json");
    });

    test("that request fails when json web token is invalid", async () => {
        const invalidJsonWebToken = "OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw";
        expect.assertions(3);
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ [SupportedRequestHeaders.xAccessToken]: invalidJsonWebToken });
        expect(response.status).toEqual(ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.type).toEqual("application/json");
    });

    test(`that request fails when json web token is out of date.`, async () => {
        const outOfDateToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw";
        expect.assertions(3);
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ [SupportedRequestHeaders.xAccessToken]: outOfDateToken });
        expect(response.status).toEqual(ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.type).toEqual("application/json");
    });


    test(`that request fails when json web token is missing from header`, async () => {
        expect.assertions(4);
        const response = await request(server).post(verifyJsonWebTokenRoute);
        expect(response.status).toEqual(ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.body.message).toBe("JSON web token is missing from header");
        expect(response.type).toEqual("application/json");
    });
});