import * as request from 'supertest'
import server from '../../src/app'
import { userModel } from '../../src/Models/User';
import { SuccessMessageKeys } from '../../src/Messages/successMessages';
import { FailureMessageKeys } from '../../src/Messages/failureMessages';
import { getLocalisedString } from '../../src/Messages/getLocalisedString';
import { MessageCategories } from '../../src/Messages/messageCategories';

const route = '/auth/login'
const registrationRoute = '/user/register'

const registeredEmail = "register@gmail.com"
const registeredPassword = "12345678"

beforeAll(async () => {
    await userModel.deleteMany({});
    return request(server).post(registrationRoute).send(
        {
            userName: "registeredUser",
            email: registeredEmail,
            password: registeredPassword
        }
    )
});

describe('auth/login', () => {
    test('user can login successfully and receives jsonWebToken in response', async () => {
        expect.assertions(6)
        const response = await request(server).post(route).send(
            {
                email: registeredEmail,
                password: registeredPassword
            }
        )
        const localisedLoginSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.loginSuccessMessage)
        expect(response.status).toEqual(200)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('jsonWebToken')
        expect(response.body.jsonWebToken.length).toBeGreaterThan(20)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(localisedLoginSuccessMessage)
    })

    test('that response is correct when incorrect email and password is used', async () => {
        expect.assertions(5)
        const response = await request(server).post(route).send(
            {
                email: 'invalidemail@gmail.com',
                password: 'invalidPassword'
            }
        )
        expect(response.status).toEqual(400)
        expect(response.type).toEqual('application/json')
        expect(response.body).not.toHaveProperty('jsonWebToken')
        expect(response.body).toHaveProperty('message')
        const localisedFailureMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)
        expect(response.body.message).toEqual(localisedFailureMessage)
    })

    test('that response is correct when invalid email and correct password is used', async () => {
        expect.assertions(5)
        const response = await request(server).post(route).send(
            {
                email: 'invalidemail@gmail.com',
                password: registeredPassword
            }
        )
        expect(response.status).toEqual(400)
        expect(response.type).toEqual('application/json')
        expect(response.body).not.toHaveProperty('jsonWebToken')
        expect(response.body).toHaveProperty('message')
        const localisedFailureMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)
        expect(response.body.message).toEqual(localisedFailureMessage)
    })

    test('that response is correct when valid email and incorrect password is used', async () => {
        expect.assertions(5)
        const response = await request(server).post(route).send(
            {
                email: registeredEmail,
                password: 'invalidPassword'
            }
        )
        expect(response.status).toEqual(400)
        expect(response.type).toEqual('application/json')
        expect(response.body).not.toHaveProperty('jsonWebToken')
        expect(response.body).toHaveProperty('message')
        const localisedFailureMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)
        expect(response.body.message).toEqual(localisedFailureMessage)
    })

    test('fails because nothing is sent with request', async () => {
        expect.assertions(4)
        const response = await request(server).post(route)
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]')
    })

    test('fails because email is missing from request', async () => {
        expect.assertions(4)
        const response = await request(server).post(route).send({
            password: "12345678"
        })
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]')
    })

    test('fails because email is invalid', async () => {
        expect.assertions(4)

        const response = await request(server).post(route).send({
            email: "invalid email",
            password: "12345678"
        })
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(`child \"email\" fails because [\"email\" must be a valid email]`)
    })

    test('fails because password is missing from request', async () => {
        expect.assertions(4)
        const response = await request(server).post(route).send({
            email: "tester1@gmail.com",
        })
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" is required]')
    })

    test('fails because password is less than 6 characters long', async () => {
        expect.assertions(4)
        const response = await request(server).post(route).send({
            email: "tester1@gmail.com",
            password: "1234"
        })
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" length must be at least 6 characters long]')
    })

    test('fails because password is not a string', async () => {
        expect.assertions(4)
        const response = await request(server).post(route).send({
            email: "tester1@gmail.com",
            password: 123456

        })
        expect(response.status).toEqual(422)
        expect(response.type).toEqual('application/json')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" must be a string]')
    })
})