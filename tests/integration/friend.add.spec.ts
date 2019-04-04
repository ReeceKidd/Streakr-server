import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { UserPaths } from '../../src/Routers/userRouter';
import { AuthPaths } from '../../src/Routers/authRouter';
import { FriendsPaths } from '../../src/Routers/friendsRouter';

const userRegisteredEmail = "add-friend-user@gmail.com"
const userRegisteredPassword = "12345678"
const userRegisteredUserName = 'add-friend-user'

const friendRegisterEmail = 'add-friend-friend@gmail.com'
const friendRegisteredPassword = '23456789'
const friendRegisteredUserName = 'add-friend-friend'

const registrationRoute = `/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${RouteCategories.auth}/${AuthPaths.login}`
const addFriendRoute = `/${RouteCategories.friends}/${FriendsPaths.add}`


describe(addFriendRoute, () => {

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

    })

    test(`that user can add a friend`, async () => {
        expect.assertions(4)
        const response = await request(server)
            .put(addFriendRoute)
            .send({
                userId,
                friendId
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
        expect(response.body.message).toBeDefined()

        const user = await userModel.findOne({ _id: userId })
        expect(user.toObject().friends).toContain(friendId)
    })

})