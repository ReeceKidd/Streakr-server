import * as request from 'supertest'

import server from '../../../src/app'
import { ApiVersions } from '../../../src/Server/versions'
import { RouteCategories } from '../../../src/routeCategories'
import { userModel } from '../../../src/Models/User';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { agendaJobModel } from '../../../src/Models/AgendaJob';
import { completeTaskModel } from '../../../src/Models/CompleteTask';

import { AuthPaths } from '../../../src/Routers/authRouter';
import { SupportedRequestHeaders } from '../../../src/Server/headers';
import { ResponseCodes } from '../../../src/Server/responseCodes';

const registeredEmail = "create-complete-tasks-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'create-complete-tasks-user'

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`

const londonTimezone = "Europe/London"


describe(createSoloStreakRoute, () => {

    let jsonWebToken: string
    let userId: string
    let soloStreakId: string
    let secondSoloStreakId: string

    const name = "Intermittent Fastings"
    const description = "I will not eat until 1pm everyday"

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
            .post(createSoloStreakRoute)
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
        await soloStreakModel.deleteOne({ _id: soloStreakId })
        await soloStreakModel.deleteOne({ _id: secondSoloStreakId })
        await agendaJobModel.deleteOne({ "data.userId": userId })
        await agendaJobModel.deleteOne({ "data.userId": userId })
        await completeTaskModel.deleteOne({ userId, streakId: soloStreakId })
        await completeTaskModel.deleteOne({ userId, streakId: secondSoloStreakId })
    })

    describe('/v1/solo-streaks/{id}/complete-tasks', () => {
        test('that user can say that a task has been completed for the day', async () => {
            expect.assertions(5)
            const completeTaskResponse = await request(server)
                .post(`/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}/${RouteCategories.completeTasks}`)
                .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
            expect(completeTaskResponse.status).toEqual(ResponseCodes.created)
            expect(completeTaskResponse.body.completeTask._id).toBeDefined()
            expect(completeTaskResponse.body.completeTask.taskCompleteTime).toBeDefined()
            expect(completeTaskResponse.body.completeTask.userId).toEqual(userId)
            expect(completeTaskResponse.body.completeTask.streakId).toEqual(soloStreakId)
        })

        test('that user cannot complete the same task in the same day', async () => {
            expect.assertions(2)
            const secondaryCreateSoloStreakResponse = await request(server)
                .post(createSoloStreakRoute)
                .send({
                    userId,
                    name,
                    description
                })
                .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
            secondSoloStreakId = secondaryCreateSoloStreakResponse.body._id
            await request(server)
                .post(`/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}/${RouteCategories.completeTasks}`)
                .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
            const secondCompleteTaskResponse = await request(server)
                .post(`/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}/${RouteCategories.completeTasks}`)
                .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [SupportedRequestHeaders.xTimeZone]: londonTimezone })
            expect(secondCompleteTaskResponse.status).toEqual(ResponseCodes.unprocessableEntity)
            expect(secondCompleteTaskResponse.body.message).toEqual('Task has already been completed today')

        })


    })

})