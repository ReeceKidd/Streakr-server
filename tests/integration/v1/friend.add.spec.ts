import * as request from 'supertest'

import server from '../../../src/app'
import { ApiVersions } from '../../../src/Server/versions'
import { RouteCategories } from '../../../src/routeCategories'
import { userModel } from '../../../src/Models/User';
import { AuthPaths } from '../../../src/Routers/authRouter';
import { UserProperties } from '../../../src/Routers/usersRouter';
import { ResponseCodes } from '../../../src/Server/responseCodes';

const userRegisteredEmail = "add-friend-user@gmail.com"
const userRegisteredPassword = "1234567a"
const userRegisteredUserName = 'add-friend-user'

const friendRegisteredEmail = 'add-friend-friend@gmail.com'
const friendRegisteredPassword = '2345678b'
const friendRegisteredUserName = 'add-friend-friend'


const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`


describe('/v1/users/:userId/friends', () => {

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

        const addFriendRouteWithUserId = `/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${UserProperties.friends}`
        const response = await request(server)
            .put(addFriendRouteWithUserId)
            .send({
                friendId
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(ResponseCodes.created)
        expect(response.type).toEqual('application/json')
        expect(response.body.message).toBeDefined()
        expect(response.body.friends).toBeDefined()
    })

})