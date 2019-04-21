import * as request from 'supertest'

import server, { ApiVersions } from '../../../src/app'
import { RouteCategories } from '../../../src/versions/v1'
import { userModel } from '../../../src/Models/User';
import { UserPaths } from '../../../src/Routers/userRouter';
import { ResponseCodes } from '../../../src/Server/responseCodes';

const userRegistationRoute = `/${ApiVersions.v1}/${RouteCategories.user}/${UserPaths.register}`

describe(userRegistationRoute, () => {

    const userName = "tester1"
    const email = "tester1@gmail.com"
    const password = "12345678"

    afterAll(async () => {
        await userModel.deleteOne({ email });
    });

    test('user can register successfully', async () => {
        expect.assertions(9)
        const response = await request(server).post(userRegistationRoute).send(
            {
                userName,
                email,
                password
            }
        )
        expect(response.status).toEqual(ResponseCodes.created)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('streaks')
        expect(response.body).toHaveProperty('role')
        expect(response.body).toHaveProperty('_id')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('userName')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')
    })
    test('fails because nothing is sent with request', async () => {
        expect.assertions(4)
        const response = await request(server).post(userRegistationRoute)
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"userName\" fails because [\"userName\" is required]')
    })

    test('fails because userName is missing from request', async () => {
        expect.assertions(4)

        const response = await request(server).post(userRegistationRoute).send({
            email: "tester1@gmail.com",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"userName\" fails because [\"userName\" is required]')
    })

    test('fails because userName already exists', async () => {
        expect.assertions(4)

        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester001@gmail.com",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.badRequest)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(`User with userName: 'tester1' already exists`)
    })

    test('fails because userName must be a string', async () => {
        expect.assertions(4)

        const response = await request(server).post(userRegistationRoute).send({
            userName: 1234567,
            email: "tester001@gmail.com",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(`child \"userName\" fails because [\"userName\" must be a string]`)
    })

    test('fails because email is missing from request', async () => {
        expect.assertions(4)
        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester1",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]')
    })

    test('fails because email already exists', async () => {
        expect.assertions(4)

        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester01",
            email: "tester1@gmail.com",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.badRequest)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(`User with email: 'tester1@gmail.com' already exists`)
    })

    test('fails because email is invalid', async () => {
        expect.assertions(4)

        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester01",
            email: "invalid email",
            password: "12345678"
        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(`child \"email\" fails because [\"email\" must be a valid email]`)
    })

    test('fails because password is missing from request', async () => {
        expect.assertions(4)
        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester1@gmail.com",
        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" is required]')
    })

    test('fails because password is less than 6 characters long', async () => {
        expect.assertions(4)
        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester1@gmail.com",
            password: "1234"

        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" length must be at least 6 characters long]')
    })

    test('fails because password is not a string', async () => {
        expect.assertions(4)
        const response = await request(server).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester1@gmail.com",
            password: 123456

        })
        expect(response.status).toEqual(ResponseCodes.unprocessableEntity)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" must be a string]')
    })
})