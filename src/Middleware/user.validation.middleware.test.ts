import { UserValidationMiddleware } from "./user.validation.middleware";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";

const className = 'UserMiddleware'
const classMethods = {
    injectDependencies: 'injectDependencies',
    setEmailExists: 'setEmailExists',
    setUserNameExists: 'setUserNameExists'
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

  describe(`${className} - ${classMethods.setEmailExists}`, () => {
    it("should set request.body.emailExists to true when email exists", async () => {
        
        const mockedDoesUserEmailExistsDatabaseCall = () => Promise.resolve(true)
        const request: any = {body: {doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.setEmailExists;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.emailExists).toBe(true);
          });      
    });

    it("should set request.body.emailExists to false when email does not exist", async () => {
        
        const mockedDoesUserNameExistsDatabaseCall = () => Promise.resolve(false)
        const request: any = {body: {doesUserNameExist: mockedDoesUserNameExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.setUserNameExists;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.userNameExists).toBe(false);
          });      
    });

  });

  describe(`${className} - ${classMethods.setUserNameExists}`, () => {
    it("should set request.body.userNameExists to true when userName exists", async () => {
        
        const mockedDoesUserNameExistsDatabaseCall = () => Promise.resolve(true)
        const request: any = {body: {doesUserNameExist: mockedDoesUserNameExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.setUserNameExists;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.userNameExists).toBe(true);
          });      
    });

    it("should set request.body.userNameExists to false when userName does not exist", async () => {
        
        const mockedDoesUserNameExistsDatabaseCall = () => Promise.resolve(false)
        const request: any = {body: {doesUserNameExist: mockedDoesUserNameExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.setUserNameExists;
        expect.assertions(1) 
        middleware(request, null, err => {
            expect(request.body.userNameExists).toBe(false);
          });      
    });
  });



  