import * as request from 'supertest'
import server from '../../src/app'
import { userModel } from '../../src/Models/User';
import { authPaths } from '../../src/Routers/authRouter';

let jsonWebToken

const registeredEmail = "register@gmail.com"
const registeredPassword = "12345678"

const registrationRoute = '/user/register'
const loginRoute = '/auth/login'
const verifyJsonWebTokenRoute = '/auth/verify-json-web-token'

authPaths

beforeAll(async () => {
    /*
    Is it better for me to get a json-web-token for each of these requests? 
    */
    await userModel.deleteMany({});
    await request(server).post(registrationRoute).send(
        {
            userName: "registeredUser",
            email: registeredEmail,
            password: registeredPassword
        }
    )
    const response = await request(server).post(loginRoute).send({
        email: registeredEmail,
        password: registeredPassword
    })
    jsonWebToken = response.body.jsonWebToken
})

describe('auth/verify-json-web-token', () => {

    test(`that request passes when json web token is valid`, async () => {
        expect.assertions(4)
        const response = await request(server).post(verifyJsonWebTokenRoute)
        expect(response.status).toEqual(200)
        expect(response.body.auth).toBe(true)
        expect(response.body.message).toBe('JSON web token is missing from header')
        expect(response.type).toEqual('application/json')
    })

    test(`that request fails when json web token is out of date.`, async () => {
        expect.assertions(4)
        const response = await request(server).post(verifyJsonWebTokenRoute)
        expect(response.status).toEqual(500)
        expect(response.body.auth).toBe(true)
        expect(response.body.message).toBe('JSON web token is missing from header')
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