import * as request from 'supertest'
import * as moment from 'moment-timezone'

import server from '../../../src/app'
import { ApiVersions } from '../../../src/Server/versions'
import { RouteCategories } from '../../../src/routeCategories'
import { userModel } from '../../../src/Models/User';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { agendaJobModel } from '../../../src/Models/AgendaJob';

import { AuthPaths } from '../../../src/Routers/authRouter';
import { SupportedRequestHeaders } from '../../../src/Server/headers';
import { manageSoloStreaksForTimezone } from '../../../src/Agenda/manageSoloStreaksForTimezone';

const registeredEmail = "manage-solo-streak-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'manage-solo-streak-user'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`

const bucharestTimezone = "Europe/Bucharest"

describe(`AGENDA manageSoloStreaksForTimezone`, () => {

    let jsonWebToken: string
    let userId: string
    let soloStreakId: string
    let updatedName: string

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
            .set({ [SupportedRequestHeaders.xTimezone]: bucharestTimezone })
        soloStreakId = createSoloStreakResponse.body._id
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail })
        await soloStreakModel.deleteOne({ name: updatedName })
        await agendaJobModel.deleteOne({ "data.timezone": bucharestTimezone })
    })

    test('test that soloStreak currentStreak gets pushed to pastStreaks and is then set to the default value', async () => {
        expect.assertions(2)
        const defaultCurrentStreak = {
            startDate: null,
            numberOfDaysInARow: 0
        }
        const endDate = new Date()
        await manageSoloStreaksForTimezone(bucharestTimezone, soloStreakModel, defaultCurrentStreak, endDate)
        const updatedSoloStreak = await soloStreakModel.findById(soloStreakId).lean()
        expect(updatedSoloStreak.currentStreak).toEqual(defaultCurrentStreak)
        expect(updatedSoloStreak.pastStreaks).toEqual([{ ...defaultCurrentStreak, endDate }])
    })

})

jest.setTimeout(30000)