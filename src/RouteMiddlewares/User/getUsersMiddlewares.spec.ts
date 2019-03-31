import { getUsersMiddlewares, getUsersValidationMiddleware, getUsersByUsernameRegexSearchMiddleware, formatUsersMiddleware, sendUsersMiddleware } from "./getUsersMiddlewares";

describe(`getUsersValidationMiddleware`, () => {

    const mockSearchQuery = 'searchQuery'

    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { searchQuery: mockSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });

    test("check that correct response is sent when userName is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is required]'
        });
        expect(next).not.toBeCalled();
    });

});


describe(`getUsersMiddlewares`, () => {
    test("that getUsersMiddlewares are defined in the correct order", () => {
        expect.assertions(4);
        expect(getUsersMiddlewares[0]).toBe(getUsersValidationMiddleware)
        expect(getUsersMiddlewares[1]).toBe(getUsersByUsernameRegexSearchMiddleware)
        expect(getUsersMiddlewares[2]).toBe(formatUsersMiddleware)
        expect(getUsersMiddlewares[3]).toBe(sendUsersMiddleware)
    });
});