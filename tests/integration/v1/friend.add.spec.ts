import * as request from 'supertest'

import server, { ApiVersions } from '../../../src/app'
import { RouteCategories } from '../../../src/versions/v1'
import { userModel } from '../../../src/Models/User';
import { UserPaths } from '../../../src/Routers/userRouter';
import { AuthPaths } from '../../../src/Routers/authRouter';
import { FriendsPaths } from '../../../src/Routers/friendsRouter';
import { ResponseCodes } from '../../../src/Server/responseCodes';

const userRegisteredEmail = "add-friend-user@gmail.com"
const userRegisteredPassword = "1234567a"
const userRegisteredUserName = 'add-friend-user'

const friendRegisteredEmail = 'add-friend-friend@gmail.com'
const friendRegisteredPassword = '2345678b'
const friendRegisteredUserName = 'add-friend-friend'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const addFriendRoute = `/${ApiVersions.v1}/${RouteCategories.friends}/${FriendsPaths.add}`


describe(addFriendRoute, () => {

    let jsonWebToken: string
    let userId: string
    let friendId: string

    beforeAll(async () => {
        const userRegistrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: userRegisteredUserName,
                    email: userRegisteredEmail,
                    password: userRegisteredPassword
                }
            )
        userId = userRegistrationResponse.body._id
        const loginResponse = await request(server)
            .post(loginRoute)
            .send(
                {
                    email: userRegisteredEmail,
                    password: userRegisteredPassword
                }
            )
        jsonWebToken = loginResponse.body.jsonWebToken
        const friendRegistrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: friendRegisteredUserName,
                    email: friendRegisteredEmail,
                    password: friendRegisteredPassword
                }
            )
        friendId = friendRegistrationResponse.body._id
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: userRegisteredEmail });
        await userModel.deleteOne({ email: friendRegisteredEmail })
    })

    test(`that user can add a friend`, async () => {
        expect.assertions(4)
        const addFriendRouteWithUserId = `${addFriendRoute}/${userId}`
        const response = await request(server)
            .put(addFriendRouteWithUserId)
            .send({
                userId,
                friendId
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(ResponseCodes.created)
        expect(response.type).toEqual('application/json')
        expect(response.body.message).toBeDefined()
        expect(response.body.friends).toBeDefined()
    })

})