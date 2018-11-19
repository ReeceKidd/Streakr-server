import { UserValidationMiddleware } from "./user.middleware";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";

const className = 'UserMiddleware'
const classFunctions = {
    doesUserEmailExist: 'doesUserEmailExist'
}

describe(`${className} - ${classFunctions.doesUserEmailExist}`, () => {
    it("should update request.body.emailAlreadyExists to be true", async() => {
        expect.assertions(1)
        const email = 'emailalreadyexists@gmail.com'
        const request = {
            email
        }
       
    });
  });
  