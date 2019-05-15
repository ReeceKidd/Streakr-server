import { patchSoloStreakMiddlewares, soloStreakRequestBodyValidationMiddleware, getPatchSoloStreakMiddleware, patchSoloStreakMiddleware, sendUpdatedPatchMiddleware } from "./patchSoloStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe('soloStreakRequestBodyValidationMiddleware', () => {

    test('that unsupported key cannot be sent in body', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { unsupportedKey: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: "\"unsupportedKey\" is not allowed"
        });
        expect(next).not.toBeCalled();
    })

    test('that correct response is sent when userId is not a string', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    })

    test('that correct response is sent when name is not a string', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { name: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" must be a string]'
        });
        expect(next).not.toBeCalled();
    })

    test('that correct response is sent when description is not a string', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { description: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" must be a string]'
        });
        expect(next).not.toBeCalled();
    })

    test('that correct response is sent when completedToday is not a boolean', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { completedToday: 1 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completedToday" fails because ["completedToday" must be a boolean]'
        });
        expect(next).not.toBeCalled();
    })

})

// describe('patchSoloStreakMiddleware', () => {
//     test('that response.locals.updatedSoloStreak is defined and next is called', async () => {
//         expect.assertions(3)
//         const soloStreakId = 'abc123'
//         const userId = '123cde'
//         const name = 'Daily programming'
//         const description = 'Do one hour of programming each day'
//         const request: any = {
//             paramas: { soloStreakId },
//             body: {
//                 userId,
//                 name,
//                 description
//             }
//         }
//         const response: any = { locals: {} }
//         const next = jest.fn()
//         const lean = jest.fn(() => true)
//         const updateOne = jest.fn(() => (Promise.resolve({ lean })))
//         const soloStreakModel = { updateOne }
//         const middleware = getPatchSoloStreakMiddleware(soloStreakModel)
//         await middleware(request, response, next)
//         expect(updateOne).toBeCalledWith({ _id: soloStreakId }, { userId, name, description })
//         expect(lean).toBeCalledWith()
//         expect(response.locals.updatedSoloStreak).toBeDefined()
//         expect(next).toBeCalledWith()
//     })
// })

describe('patchSoloStreakMiddlewares', () => {

    test('that patchSoloStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(3)
        expect(patchSoloStreakMiddlewares[0]).toBe(soloStreakRequestBodyValidationMiddleware)
        expect(patchSoloStreakMiddlewares[1]).toBe(patchSoloStreakMiddleware)
        expect(patchSoloStreakMiddlewares[2]).toBe(sendUpdatedPatchMiddleware)
    })

})