import { UserValidationMiddleware } from "./user.validation.middleware";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";

const className = 'UserMiddleware'
const classMethods = {
    doesUserEmailExist: 'doesUserEmailExist'
}

describe(`${className} - ${classMethods.doesUserEmailExist}`, () => {
    it("should update request.body.emailAlreadyExists to be true", async () => {
        expect.assertions(1)
        const email = 'emailalreadyexists@gmail.com'
        const request: any = {
            body: {email}
        }
        const result = UserValidationMiddleware.doesUserEmailExist;       
        console.log(result)
        expect(result).toBe({})
    });
  });
  