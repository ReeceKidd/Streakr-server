import request from "supertest";

import server from "../../../src/app";
import { ApiVersions } from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { UserProperties } from "../../../src/Routers/usersRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const userRegisteredEmail = "get-friends-user@gmail.com";
const userRegisteredPassword = "12345678";
const userRegisteredUserName = "get-friends-user";

const friendRegisteredEmail = "get-friends-friend@gmail.com";
const friendRegisteredPassword = "23456789";
const friendRegisteredUserName = "get-friends-friend";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;

describe("getFriendsRoute", () => {

    let jsonWebToken: string;
    let userId: string;
    let friendId: string;

    beforeAll(async () => {
        const userRegistrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: userRegisteredUserName,
                    email: userRegisteredEmail,
                    password: userRegisteredPassword
                }
            );
        userId = userRegistrationResponse.body._id;
        const loginResponse = await request(server)
            .post(loginRoute)
            .send(
                {
                    email: userRegisteredEmail,
                    password: userRegisteredPassword
                }
            );
        jsonWebToken = loginResponse.body.jsonWebToken;
        const friendRegistrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: friendRegisteredUserName,
                    email: friendRegisteredEmail,
                    password: friendRegisteredPassword
                }
            );
        friendId = friendRegistrationResponse.body._id;
        const addFriendRoute = `/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${UserProperties.friends}`;
        await request(server)
            .put(addFriendRoute)
            .send({
                friendId
            })
            .set({ "x-access-token": jsonWebToken });
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: userRegisteredEmail });
        await userModel.deleteOne({ email: friendRegisteredEmail });
    });


    test(`that friends can be retreived for user`, async () => {
        expect.assertions(4);
        const getFriendsRouteWithUserId = `/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${UserProperties.friends}`;

        const getFriendsResponse = await request(server)
            .get(getFriendsRouteWithUserId)
            .set({ "x-access-token": jsonWebToken });
        expect(getFriendsResponse.status).toEqual(ResponseCodes.success);
        expect(getFriendsResponse.type).toEqual("application/json");
        expect(getFriendsResponse.body.friends.length).toEqual(1);
        expect(getFriendsResponse.body.friends[0].userName).toEqual(friendRegisteredUserName);

    });

});