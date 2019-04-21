import * as request from 'supertest'

import server, { ApiVersions } from '../../../src/app'
import { RouteCategories } from '../../../src/versions/v1'
import { userModel } from '../../../src/Models/User';
import { UserPaths } from '../../../src/Routers/userRouter';
import { AuthPaths } from '../../../src/Routers/authRouter';
import { FriendsPaths } from '../../../src/Routers/friendsRouter';
import { ResponseCodes } from '../../../src/REST/responseCodes';

const userRegisteredEmail = "get-friends-user@gmail.com"
const userRegisteredPassword = "12345678"
const userRegisteredUserName = 'get-friends-user'

const friendRegisteredEmail = 'get-friends-friend@gmail.com'
const friendRegisteredPassword = '23456789'
const friendRegisteredUserName = 'get-friends-friend'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const getFriendsRoute = `/${ApiVersions.v1}/${RouteCategories.friends}`

describe(getFriendsRoute, () => {

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
        const addFriendRoute = `/${ApiVersions.v1}/${RouteCategories.friends}/${FriendsPaths.add}/${userId}`
        await request(server)
            .put(addFriendRoute)
            .send({
                userId,
                friendId
            })
            .set({ 'x-access-token': jsonWebToken })
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: userRegisteredEmail })
        await userModel.deleteOne({ email: friendRegisteredEmail })
    })


    test(`that friends can be retreived for user`, async () => {
        expect.assertions(4)
        const getFriendsRouteWithUserId = `${getFriendsRoute}/${userId}`
        const getFriendsResponse = await request(server)
            .get(getFriendsRouteWithUserId)
            .set({ 'x-access-token': jsonWebToken })
        expect(getFriendsResponse.status).toEqual(ResponseCodes.success)
        expect(getFriendsResponse.type).toEqual('application/json')
        expect(getFriendsResponse.body.friends.length).toEqual(1)
        expect(getFriendsResponse.body.friends[0].userName).toEqual(friendRegisteredUserName)
    })

})