import * as request from 'supertest'
import * as moment from 'moment-timezone'

import server from '../../../src/app'
import { ApiVersions } from '../../../src/Server/versions'
import { RouteCategories } from '../../../src/routeCategories'
import { userModel } from '../../../src/Models/User';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { agendaJobModel } from '../../../src/Models/AgendaJob';

import { AuthPaths } from '../../../src/Routers/authRouter';
import { ResponseCodes } from '../../../src/Server/responseCodes';
import { SupportedRequestHeaders } from '../../../src/Server/headers';
import { AgendaJobs } from '../../../config/Agenda';

const registeredEmail = "create-solo-streak-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'create-solo-streak-user'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`

const londonTimezone = "Europe/London"


describe(`DELETE ${soloStreakRoute}`, () => {

    let jsonWebToken: string
    let userId: string
    let soloStreakId: string

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
        const createSoloStreakResponse = await request(server)
            .post(soloStreakRoute)
            .send({
                userId,
                name,
                description
            })
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
        soloStreakId = createSoloStreakResponse.body._id
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail })
        await soloStreakModel.deleteOne({ name })
        await agendaJobModel.deleteOne({ "data.userId": userId })
    })

    test(`that solo streak can be deleted`, async () => {
        expect.assertions(1)
        const response = await request(server)
            .delete(`${soloStreakRoute}/${soloStreakId}`)
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
        expect(response.status).toEqual(ResponseCodes.deleted)
    })

})