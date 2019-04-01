import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { UserPaths } from '../../src/Routers/userRouter';
import { UsersPaths } from '../../src/Routers/usersRouter';
import { AuthPaths } from '../../src/Routers/authRouter';

const registeredEmail = "regex-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'create-solo-streak-user'

const registrationRoute = `/${RouteCategories.user}/${UserPaths.register}`
const getUsersByRegexSearchRoute = `/${RouteCategories.users}/${UsersPaths.getUsersByRegexSearch}`
const loginRoute = `/${RouteCategories.auth}/${AuthPaths.login}`


describe(getUsersByRegexSearchRoute, () => {

    let jsonWebToken: string
    let userId

    beforeAll(async () => {
        await userModel.deleteMany({});
        const registrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: registeredUserName,
                    email: registeredEmail,
                    password: registeredPassword
                }
            )
        userId = registrationResponse.body._id
        const loginResponse = await request(server)
            .post(loginRoute)
            .send(
                {
                    email: registeredEmail,
                    password: registeredPassword
                }
            )
        jsonWebToken = loginResponse.body.jsonWebToken
    })

    test(`that request passes when correct solo streak information is passed`, async () => {
        expect.assertions(2)
        const response = await request(server)
            .post(createSoloStreakRoute)
            .send({
                userId,
                streakName: "Daily Spanish",
                streakDescription: "Each day I must do the insane amount 50xp on Duolingo"
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
    })

})