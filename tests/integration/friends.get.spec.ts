import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { UserPaths } from '../../src/Routers/userRouter';
import { AuthPaths } from '../../src/Routers/authRouter';
import { FriendPaths } from '../../src/Routers/friendRouter';

const userRegisteredEmail = "get-friends-user@gmail.com"
const userRegisteredPassword = "12345678"
const userRegisteredUserName = 'get-friends-user'

const friendRegisterEmail = 'get-friends-friend@gmail.com'
const friendRegisteredPassword = '23456789'
const friendRegisteredUserName = 'get-friends-friend'

const registrationRoute = `/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${RouteCategories.auth}/${AuthPaths.login}`
const addFriendRoute = `/${RouteCategories.friend}/${FriendPaths.add}`
const getFriendsRoute = `/${RouteCategories.friends}`


describe(getFriendsRoute, () => {

    let jsonWebToken: string
    let userId: string
    let friendId: string

    beforeAll(async () => {
        await userModel.deleteMany({});
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
                    email: friendRegisterEmail,
                    password: friendRegisteredPassword
                }
            )
        friendId = friendRegistrationResponse.body._id
        const friendAddedResponse = await request(server)
            .put(addFriendRoute)
            .send({
                userId,
                friendId
            })
            .set({ 'x-access-token': jsonWebToken })
        console.log(`Friend added status: ${friendAddedResponse.status}`)

    })

    test(`that friends can be retreived for user`, async () => {
        expect.assertions(3)
        const getFriendsRouteWithUserId = `${getFriendsRoute}/${userId}`
        const getFriendsResponse = await request(server)
            .get(getFriendsRouteWithUserId)
            .set({ 'x-access-token': jsonWebToken })
        expect(getFriendsResponse.status).toEqual(200)
        expect(getFriendsResponse.type).toEqual('application/json')
        expect(getFriendsResponse.body.friends.length).toEqual(1)
    })

})