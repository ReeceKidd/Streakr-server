import {
  createStripeCustomerSubscriptionMiddlewares,
  createStripeCustomerSubscriptionBodyValidationMiddleware,
  doesStripeCustomerExistMiddleware,
  createStripeCustomerMiddleware,
  createStripeSubscriptionMiddleware,
  handleInitialPaymentOutcomeMiddleware,
  sendSuccessfulSubscriptionMiddleware
} from "./createStripeCustomerSubscriptionMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe("createStripeCustomerSubscriptionMiddlewares", () => {
  describe("createStripeCustomerSubscriptionMiddleware", () => {
    const token = "1234";
    const email = "test@test.com";

    test("sends correct error response when unsupported key is sent", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { unsupportedKey: 1234, token, email }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(400);
      expect(send).toBeCalledWith({
        message: '"unsupportedKey" is not allowed'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when token is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { email }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "token" fails because ["token" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not a string", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token, email: 1234 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" must be a string]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not valid", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token, email: "not an email" }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" must be a valid email]'
      });
      expect(next).not.toBeCalled();
    });
  });

  test("are defined in the correct order", () => {
    expect.assertions(7);

    expect(createStripeCustomerSubscriptionMiddlewares.length).toEqual(6);
    expect(createStripeCustomerSubscriptionMiddlewares[0]).toBe(
      createStripeCustomerSubscriptionBodyValidationMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[1]).toBe(
      doesStripeCustomerExistMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[2]).toBe(
      createStripeCustomerMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[3]).toBe(
      createStripeSubscriptionMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[4]).toBe(
      handleInitialPaymentOutcomeMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[5]).toBe(
      sendSuccessfulSubscriptionMiddleware
    );
  });
});
