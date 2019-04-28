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
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`

const londonTimezone = "Europe/London"


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
        await agendaJobModel.deleteOne({ name: AgendaJobs.soloStreakTracker })
    })

    test(`that request passes when correct solo streak information is passed`, async () => {
        expect.assertions(13)
        const response = await request(server)
            .post(createSoloStreakRoute)
            .send({
                userId,
                name,
                description
            })
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
        expect(response.status).toEqual(ResponseCodes.created)
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
        const endOfDay = moment().tz(londonTimezone).endOf('day').toDate()
        const agendaJob = await agendaJobModel.findOne({ name: AgendaJobs.soloStreakTracker })
        expect((agendaJob.data as any).userId).toEqual(userId)
        expect(agendaJob.nextRunAt).toEqual(endOfDay)

    })

})