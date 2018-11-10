import { celebrate } from "celebrate";
import { UserValidation } from "./user.validation";

celebrate(UserValidation.register)

const validUserName =  "Tester"
const validEmail = "tester@gmail.com"
const validPassword = "password"


describe('User Validation Test', () => {
    it('Tests that userName is required', () => {
        const request = {
            body: {userName: undefined, email: validEmail, password: validPassword},
            params: {},
            query: {},
        }
        expect(celebrate(UserValidation.register, request)).toBe({})
    })
})