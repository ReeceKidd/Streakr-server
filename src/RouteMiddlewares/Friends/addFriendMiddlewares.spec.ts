import { addFriendMiddlewares, addFriendValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, addFriendMiddleware, sendSuccessMessageMiddleware } from "./addFriendMiddlewares";

describe('addFriendMiddlewares', () => {
    test('that middlewares are defined in the correct order', () => {
        expect.assertions(5)
        expect(addFriendMiddlewares[0]).toBe(addFriendValidationMiddleware)
        expect(addFriendMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(addFriendMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(addFriendMiddlewares[3]).toBe(addFriendMiddleware)
        expect(addFriendMiddlewares[4]).toBe(sendSuccessMessageMiddleware)
    })

})