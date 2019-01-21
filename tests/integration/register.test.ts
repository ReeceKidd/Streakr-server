import * as request from 'supertest'
import server from '../../src/app'

const route = '/register'

describe('/register', () => {
    test('It should fail because register request is missing', async () => {
        const response = await request(server).post(route)
        expect(response.status).toBe(404)
    })
})