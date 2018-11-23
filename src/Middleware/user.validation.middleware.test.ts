import { UserValidationMiddleware } from "./user.validation.middleware";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";

const className = 'UserMiddleware'
const classMethods = {
    injectDependencies: 'injectDependencies',
    doesEmailExist: 'doesEmailExist',
    doesUserNameExist: 'doesUserNameExist',
    emailExistsValidation: 'emailExistsValidation', 
    userNameExistsValidation: 'userNameExistsValidation'
}

  describe(`${className} - ${classMethods.injectDependencies}`, () => {
    it("should update response.body to contain the validation functions for dependency injection", async () => {
        
        const response: any = {body: {}} 
        const middleware = UserValidationMiddleware.injectDependencies;
        expect.assertions(2) 
        middleware(response, null, err => {
            expect(response.locals.doesUserEmailExist).toBe(UserDatabaseHelper.doesUserEmailExist);
            expect(response.locals.doesUserNameExist).toBe(UserDatabaseHelper.doesUserNameExist);
          });      
    });
  });

  describe(`${className} - ${classMethods.doesEmailExist}`, () => {
    it("should set response.locals.emailExists to true when email exists", async () => {
        
        const mockedDoesUserEmailExistsDatabaseCall = () => Promise.resolve(true)
        const response: any = {body: {doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesEmailExist;
        expect.assertions(1) 
        middleware(response, null, err => {
            expect(response.locals.emailExists).toBe(true);
          });      
    });

    it("should set response.locals.emailExists to false when email does not exist", async () => {
        
        const mockedDoesEmailExistsDatabaseCall = () => Promise.resolve(false)
        const response: any = {body: {doesUserNameExist: mockedDoesEmailExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesUserNameExist;
        expect.assertions(1) 
        middleware(response, null, err => {
            expect(response.locals.userNameExists).toBe(false);
          });      
    });

  });

  describe(`${className} - ${classMethods.doesUserNameExist}`, () => {
    it("should set response.locals.userNameExists to true when userName exists", async () => {
        
        const mockedDoesUserNameExistsDatabaseCall = () => Promise.resolve(true)
        const response: any = {body: {doesUserNameExist: mockedDoesUserNameExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesUserNameExist;
        expect.assertions(1) 
        middleware(response, null, err => {
            expect(response.locals.userNameExists).toBe(true);
          });      
    });

    it("should set response.locals.userNameExists to false when userName does not exist", async () => {
        
        const mockedDoesUserNameExistsDatabaseCall = () => Promise.resolve(false)
        const response: any = {body: {doesUserNameExist: mockedDoesUserNameExistsDatabaseCall}}

        const middleware = await UserValidationMiddleware.doesUserNameExist;
        expect.assertions(1) 
        middleware(response, null, err => {
            expect(response.locals.userNameExists).toBe(false);
          });      
    });
  });

  describe(`${className} - ${classMethods.emailExistsValidation}`, () => {
    it("should update response.body to contain the validation functions for dependency injection", async () => {
        
        const response: any = {body: {}} 
        const middleware = UserValidationMiddleware.injectDependencies;
        expect.assertions(2) 
        middleware(response, null, err => {
            expect(response.locals.doesUserEmailExist).toBe(UserDatabaseHelper.doesUserEmailExist);
            expect(response.locals.doesUserNameExist).toBe(UserDatabaseHelper.doesUserNameExist);
          });      
    });
  });

  describe(`${className} - ${classMethods.userNameExistsValidation}`, () => {
    it("should update response.body to contain the validation functions for dependency injection", async () => {
        
        const response: any = {body: {}} 
        const middleware = UserValidationMiddleware.injectDependencies;
        expect.assertions(2) 
        middleware(response, null, err => {
            expect(response.locals.doesUserEmailExist).toBe(UserDatabaseHelper.doesUserEmailExist);
            expect(response.locals.doesUserNameExist).toBe(UserDatabaseHelper.doesUserNameExist);
          });      
    });
  });

  // Need to do the tests for email exists validation and username exists validation, and then 
  // update the route to use all of the user validation middleware. 



  