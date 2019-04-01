import * as request from 'supertest'

import server, { RouteCategories } from '../../src/app'
import { userModel } from '../../src/Models/User';
import { UserPaths } from '../../src/Routers/userRouter';
import { UsersPaths } from '../../src/Routers/usersRouter';
import { AuthPaths } from '../../src/Routers/authRouter';

const registeredEmail = "search-user@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = 'search-user'

const searchableUserEmail = "other-user@gmail.com"
const searchableUserPassword = "12345678"
const searchableUserUserName = 'other-user'

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
            .send({
                userName: registeredUserName,
                email: registeredEmail,
                password: registeredPassword
            })
        userId = registrationResponse.body._id
        const loginResponse = await request(server)
            .post(loginRoute)
            .send({
                email: registeredEmail,
                password: registeredPassword
            })
        jsonWebToken = loginResponse.body.jsonWebToken
        await request(server)
            .post(registrationRoute)
            .send({
                userName: searchableUserUserName,
                email: searchableUserEmail,
                password: searchableUserPassword
            })
    })

    test(`that request returns searchAbleUser when full searchTerm is uaed`, async () => {
        expect.assertions(10)
        const response = await request(server)
            .get(getUsersByRegexSearchRoute)
            .send({
                searchQuery: searchableUserUserName
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.body.length).toBe(1)
        expect(response.type).toEqual('application/json')
        expect(response.body[0]).toHaveProperty('streaks')
        expect(response.body[0]).toHaveProperty('role')
        expect(response.body[0]).toHaveProperty('_id')
        expect(response.body[0]).toHaveProperty('userName')
        expect(response.body[0]).toHaveProperty('email')
        expect(response.body[0]).toHaveProperty('createdAt')
        expect(response.body[0]).toHaveProperty('updatedAt')
    })

    test('that request returns searchAble user when partial searchTerm is used', async () => {
        expect.assertions(10)
        const response = await request(server)
            .get(getUsersByRegexSearchRoute)
            .send({
                searchQuery: `${searchableUserUserName[0]}${searchableUserUserName[1]}${searchableUserUserName[2]}`
            })
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
        expect(response.body.length).toBe(1)
        expect(response.body[0]).toHaveProperty('streaks')
        expect(response.body[0]).toHaveProperty('role')
        expect(response.body[0]).toHaveProperty('_id')
        expect(response.body[0]).toHaveProperty('userName')
        expect(response.body[0]).toHaveProperty('email')
        expect(response.body[0]).toHaveProperty('createdAt')
        expect(response.body[0]).toHaveProperty('updatedAt')
    })

})