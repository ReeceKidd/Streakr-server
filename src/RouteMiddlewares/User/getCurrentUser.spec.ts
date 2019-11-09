/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendCurrentUserMiddleware, getCurrentUserMiddlewares } from './getCurrentUser';
import { CustomError } from '../../customError';
import { ErrorType } from '../../customError';

describe('sendRetreiveUserResponseMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const user = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { user }, status };
        const next = jest.fn();

        sendCurrentUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(user);
    });

    test('calls next with SendRetreiveUserResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendCurrentUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('getCurrentUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(2);

        expect(getCurrentUserMiddlewares.length).toEqual(1);
        expect(getCurrentUserMiddlewares[0]).toEqual(sendCurrentUserMiddleware);
    });
});
