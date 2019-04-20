import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { soloStreakModel } from '../../src/Models/SoloStreak';

import { SoloStreakPaths } from '../../src/Routers/soloStreakRouter';
import { UserPaths } from '../../src/Routers/userRouter';
import { AuthPaths } from '../../src/Routers/authRouter';

const registeredEmail = "create-solo-streak-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'create-solo-streak-user'

const registrationRoute = `/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${RouteCategories.auth}/${AuthPaths.login}`
const createSoloStreakRoute = `/${RouteCategories.soloStreak}/${SoloStreakPaths.create}`


describe(createSoloStreakRoute, () => {

    let jsonWebToken: string
    let userId: string

    const name = "Keto"
    const description = "I will follow the keto diet every day"

    beforeAll(async () => {
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

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail })
        await soloStreakModel.deleteOne({ name })
    })

    test(`that request passes when correct solo streak information is passed`, async () => {
        expect.assertions(11)
        const response = await request(server)
            .post(createSoloStreakRoute)
            .send({
                userId,
                name,
                description
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('_id')
        expect(response.body).toHaveProperty('startDate')
        expect(response.body).toHaveProperty('calendar')
        expect(response.body).toHaveProperty('name')
        expect(response.body.name).toBe(name)
        expect(response.body.description).toBe(description)
        expect(response.body.userId).toBe(userId)
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')
    })

})