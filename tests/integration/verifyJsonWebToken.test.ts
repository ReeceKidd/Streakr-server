import * as request from 'supertest'
import server from '../../src/app'
import { userModel } from '../../src/Models/User';

const registeredEmail = "register@gmail.com"
const registeredPassword = "12345678"

const registrationRoute = '/user/register'
const loginRoute = '/auth/login'
const verifyJsonWebTokenRoute = '/auth/verify-json-web-token'

beforeAll(async () => {
    userModel.deleteMany({});
    return request(server).post(registrationRoute).send(
        {
            "userName": "tester1",
            "email": registeredEmail,
            "password": registeredPassword
        }
    )
})

describe('auth/verify-json-web-token', () => {
    test(`that request passes when json web token is valid`, async () => {
        expect.assertions(4)
        jest.setTimeout(15000)
        const loginResponse = await request(server).post(loginRoute).send(
            {
                email: registeredEmail,
                password: registeredPassword
            }
        )
        const jsonWebToken = loginResponse.body.jsonWebToken
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.body.auth).toBe(true)
        expect(response.body.message).toBe('JSON web token is missing from header')
        expect(response.type).toEqual('application/json')
    })

    test('that request fails when json web token is invalid', async () => {
        const invalidJsonWebToken = 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(5)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': invalidJsonWebToken })
        expect(response.status).toEqual(400)
        expect(response.body.auth).toBe(false)
        expect(response.body.name).toBe('JsonWebTokenError')
        expect(response.body.message).toBe('invalid token')
        expect(response.type).toEqual('application/json')
    })

    test(`that request fails when json web token is out of date.`, async () => {
        const outOfDateToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(6)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': outOfDateToken })
        expect(response.status).toEqual(400)
        expect(response.body.auth).toBe(false)
        expect(response.body.name).toBe('TokenExpiredError')
        expect(response.body.message).toBe('jwt expired')
        expect(response.body.expiredAt).toBe('2019-01-16T06:15:39.000Z')
        expect(response.type).toEqual('application/json')
    })


    test(`that request fails when json web token is missing from header`, async () => {
        expect.assertions(4)
        const response = await request(server).post(verifyJsonWebTokenRoute)
        expect(response.status).toEqual(401)
        expect(response.body.auth).toBe(false)
        expect(response.body.message).toBe('JSON web token is missing from header')
        expect(response.type).toEqual('application/json')
    })
})