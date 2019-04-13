import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { SoloStreakPaths } from '../../src/Routers/soloStreakRouter';
import { UserPaths } from '../../src/Routers/userRouter';
import { AuthPaths } from '../../src/Routers/authRouter';
import { SoloStreaksPaths } from '../../src/Routers/soloStreaksRouter';

const registeredEmail = "get-solo-streaks@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'get-solo-streaks-user'

const registrationRoute = `/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${RouteCategories.auth}/${AuthPaths.login}`
const createSoloStreakRoute = `/${RouteCategories.soloStreak}/${SoloStreakPaths.create}`
const getSoloStreaksRoute = `/${RouteCategories.soloStreaks}/${SoloStreaksPaths.get}`

const soloStreakName = "Daily Spanish"
const soloStreakDescription = "Each day I must do the insame amount 50xp of Duolingo"

const accessToken = 'x-access-token'

describe(createSoloStreakRoute, () => {

    let jsonWebToken: string
    let userId: string

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
        await request(server)
            .post(createSoloStreakRoute)
            .send({
                userId,
                streakName: soloStreakName,
                streakDescription: soloStreakDescription,
            })
            .set({ [accessToken]: jsonWebToken })
    })

    test(`that solo streaks can be retreived for user`, async () => {
        expect.assertions(11)
        const getSoloStreaksRouteWithUserId = `${getSoloStreaksRoute}/${userId}`
        const response = await request(server)
            .get(getSoloStreaksRouteWithUserId)
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
        expect(response.body.soloStreaks.length).toEqual(1)
        expect(response.body.soloStreaks[0]).toHaveProperty('_id')
        expect(response.body.soloStreaks[0]).toHaveProperty('startDate')
        expect(response.body.soloStreaks[0]).toHaveProperty('calendar')
        expect(response.body.soloStreaks[0]).toHaveProperty('streakName')
        expect(response.body.soloStreaks[0]).toHaveProperty('streakDescription')
        expect(response.body.soloStreaks[0]).toHaveProperty('userId')
        expect(response.body.soloStreaks[0]).toHaveProperty('createdAt')
        expect(response.body.soloStreaks[0]).toHaveProperty('updatedAt')
    })

})