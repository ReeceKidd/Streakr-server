import * as request from 'supertest'
import server from '../../src/app'
import { userModel } from '../../src/Models/User';
const route = '/user/register'

beforeAll(() => {
    return userModel.deleteMany({});
});

describe('/register', () => {
    test('It should succesully reigster user', async () => {
        const response = await request(server).post(route).send(
            {
                "userName": "tester1",
                "email": "tester1@gmail.com",
                "password": "12345678"
            }
        )
        expect(response.status).toBe(200)
    })
    test('It should fail because register request is missing', async () => {
        const response = await request(server).post(route)
        expect(response.status).toBe(422)
    })
})