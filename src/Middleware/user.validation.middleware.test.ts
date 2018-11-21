import { UserValidationMiddleware } from "./user.validation.middleware";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";

const className = 'UserMiddleware'
const classMethods = {
    injectDependencies: 'injectDependencies',
    doesUserEmailExist: 'doesUserEmailExist'
}


  describe(`${className} - ${classMethods.injectDependencies}`, () => {
    it("should update request.body to contain the validation functions for dependency injection", async () => {
        
        const request: any = {body: {}} 
        const middleware = UserValidationMiddleware.injectDependencies;
        expect.assertions(2) 
        middleware(request, null, err => {
            expect(request.body.doesUserEmailExist).toBe(UserDatabaseHelper.doesUserEmailExist);
            expect(request.body.doesUserNameExist).toBe(UserDatabaseHelper.doesUserNameExist);
          });      
    });
  });

  describe(`${className} - ${classMethods.doesUserEmailExist}`, () => {
    it("should set request.body.emailAlreadyExists to true when email already exists", async () => {
        
        const mockedDoesUserEmailExistsDatabaseCall = () => Promise.resolve(true)
        const request: any = {body: {doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesUserEmailExist;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.emailAlreadyExists).toBe(true);
          });      
    });

    it("should set request.body.emailAlreadyExists to false when email doesn't exist", async () => {
        
        const mockedDoesUserEmailExistsDatabaseCall = () => Promise.resolve(false)
        const request: any = {body: {doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesUserEmailExist;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.emailAlreadyExists).toBe(false);
          });      
    });
  });


  