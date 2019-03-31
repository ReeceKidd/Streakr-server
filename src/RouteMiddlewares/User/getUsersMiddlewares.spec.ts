import { getUsersMiddlewares, getUsersValidationMiddleware, getUsersByUsernameRegexSearchMiddleware, formatUsersMiddleware, sendUsersMiddleware, maximumSearchQueryLength } from "./getUsersMiddlewares";

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

    test("check that correct response is sent when searchQuery is missing", () => {
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

    test("check that correct response is sent when searchQuery is missing", () => {
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

    test("check that correct response is sent when searchQuery length is too short", () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const shortSearchQuery = ""

        const request: any = {
            body: { searchQuery: shortSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]'
        });
        expect(next).not.toBeCalled();
    })

    test(`check that correct response is sent when searchQuery length is longer than ${maximumSearchQueryLength}`, () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const longSearchQuery = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

        const request: any = {
            body: { searchQuery: longSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]'
        });
        expect(next).not.toBeCalled();
    })

    test(`check that correct response is sent when searchQuery is not a string`, () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const numberSearchQuery = 123

        const request: any = {
            body: { searchQuery: numberSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" must be a string]'
        });
        expect(next).not.toBeCalled();
    })

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