import * as request from 'supertest'

import server, { ApiVersions } from '../../../src/app'
import { RouteCategories } from '../../../src/versions/v1'
import { userModel } from '../../../src/Models/User';
import { SoloStreakPaths } from '../../../src/Routers/soloStreakRouter';
import { UserPaths } from '../../../src/Routers/userRouter';
import { AuthPaths } from '../../../src/Routers/authRouter';
import { SoloStreaksPaths } from '../../../src/Routers/soloStreaksRouter';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { ResponseCodes } from '../../../src/Server/responseCodes';

const registeredEmail = "get-solo-streaks@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'get-solo-streaks-user'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreak}/${SoloStreakPaths.create}`
const getSoloStreaksRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${SoloStreaksPaths.get}`

const soloStreakName = "Daily Spanish"
const soloStreakDescription = "Each day I must do the insame amount 50xp of Duolingo"

const accessToken = 'x-access-token'

describe(getSoloStreaksRoute, () => {

    let jsonWebToken: string
    let userId: string

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
        const createSoloStreak = await request(server)
            .post(createSoloStreakRoute)
            .send({
                userId,
                name: soloStreakName,
                description: soloStreakDescription,
            })
            .set({ [accessToken]: jsonWebToken })
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail });
        await soloStreakModel.deleteOne({ name: soloStreakName });
    })

    test(`that solo streaks can be retreived for user`, async () => {
        expect.assertions(11)
        const getSoloStreaksRouteWithUserId = `${getSoloStreaksRoute}/${userId}`
        const response = await request(server)
            .get(getSoloStreaksRouteWithUserId)
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(ResponseCodes.success)
        expect(response.type).toEqual('application/json')
        expect(response.body.soloStreaks.length).toEqual(1)
        expect(response.body.soloStreaks[0]).toHaveProperty('_id')
        expect(response.body.soloStreaks[0]).toHaveProperty('startDate')
        expect(response.body.soloStreaks[0]).toHaveProperty('calendar')
        expect(response.body.soloStreaks[0].name).toBe(soloStreakName)
        expect(response.body.soloStreaks[0].description).toBe(soloStreakDescription)
        expect(response.body.soloStreaks[0].userId).toBe(userId)
        expect(response.body.soloStreaks[0]).toHaveProperty('createdAt')
        expect(response.body.soloStreaks[0]).toHaveProperty('updatedAt')
    })

})