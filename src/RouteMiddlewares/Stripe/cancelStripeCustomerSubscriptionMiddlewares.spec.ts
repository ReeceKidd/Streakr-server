import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  cancelStripeCustomerSubscriptionBodyValidationMiddleware,
  cancelStripeCustomerSubscriptionMiddlewares,
  doesUserHaveStripeSubscriptionMiddleware,
  cancelStripeSubscriptionMiddleware,
  removeSubscriptionFromUserMiddleware,
  sendSuccessfullyRemovedSubscriptionMiddleware,
  getDoesUserHaveStripeSubscriptionMiddleware,
  stripe,
  getRemoveSubscriptionFromUserMiddleware,
  getSetUserTypeToBasicMiddleware,
  setUserTypeToBasicMiddleware
} from "./cancelStripeCustomerSubscriptionMiddlewares";

describe("cancelStripeCustomerSubscriptionMiddlewares", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("cancelStripeCustomerSubscriptionBodyValidationMiddleware", () => {
    const subscription = "subscription";
    const id = "id";

    test("sends correct error response when unsupported key is sent", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { unsupportedKey: 1234, subscription, id }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      cancelStripeCustomerSubscriptionBodyValidationMiddleware(
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

    test("sends correct error response when subscription is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { id }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      cancelStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message:
          'child "subscription" fails because ["subscription" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when id is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { subscription }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      cancelStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "id" fails because ["id" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when id is not a string", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { subscription, id: 1234 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      cancelStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "id" fails because ["id" must be a string]'
      });
      expect(next).not.toBeCalled();
    });
  });

  describe("doesUserHaveStripeSubscriptionMiddleware", () => {
    test("calls next if user exists and has a premium type", async () => {
      expect.assertions(2);
      const id = "id";
      const findById = jest.fn().mockResolvedValue({ type: "premium" });
      const userModel: any = {
        findById
      };
      const request: any = {
        body: {
          id
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const doesUserHaveStripeSubscriptionMiddleware = getDoesUserHaveStripeSubscriptionMiddleware(
        userModel
      );

      await doesUserHaveStripeSubscriptionMiddleware(request, response, next);

      expect(findById).toBeCalledWith(id);
      expect(next).toBeCalledWith();
    });

    test("calls next with CancelStripeSubscriptionUserDoesNotExist error if user doesn't exist", async () => {
      expect.assertions(1);
      const id = "id";
      const findById = jest.fn().mockResolvedValue(false);
      const userModel: any = {
        findById
      };
      const request: any = {
        body: {
          id
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const doesUserHaveStripeSubscriptionMiddleware = getDoesUserHaveStripeSubscriptionMiddleware(
        userModel
      );

      await doesUserHaveStripeSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.CancelStripeSubscriptionUserDoesNotExist)
      );
    });

    test("calls next with CustomerIsNotSubscribed error if user type is not set to premium", async () => {
      expect.assertions(1);
      const id = "id";
      const findById = jest.fn().mockResolvedValue({
        type: "basic"
      });
      const userModel: any = {
        findById
      };
      const request: any = {
        body: {
          id
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const doesUserHaveStripeSubscriptionMiddleware = getDoesUserHaveStripeSubscriptionMiddleware(
        userModel
      );

      await doesUserHaveStripeSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.CustomerIsNotSubscribed)
      );
    });

    test("calls next with DoesUserHaveStripeSubscriptionMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const email = "test@test.com";
      const userModel: any = {};
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const doesUserHaveStripeSubscriptionMiddleware = getDoesUserHaveStripeSubscriptionMiddleware(
        userModel
      );

      await doesUserHaveStripeSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.DoesUserHaveStripeSubscriptionMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("cancelStripeSubscriptionMiddleware", () => {
    test("cancels stripe subscription", async () => {
      expect.assertions(2);
      const subscription = "subscription";
      stripe.subscriptions.del = jest.fn().mockResolvedValue({});
      const request: any = {
        body: {
          subscription
        }
      };
      const response: any = {};
      const next = jest.fn();

      await cancelStripeSubscriptionMiddleware(request, response, next);

      expect(stripe.subscriptions.del).toBeCalledWith(subscription);
      expect(next).toBeCalledWith();
    });

    test("calls next with CancelStripeSubscriptionMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      await cancelStripeSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.CancelStripeSubscriptionMiddleware)
      );
    });
  });

  describe("removeSubcriptionFromUserMiddleware", () => {
    test("updates users stripe.subscription property to be false", async () => {
      expect.assertions(3);
      const findByIdAndUpdate = jest.fn().mockResolvedValue({});
      const userModel = {
        findByIdAndUpdate
      };
      const id = "id";
      const user = {
        id
      };
      const request: any = {};
      const response: any = {
        locals: {
          user
        }
      };
      const next = jest.fn();
      const removeSubscriptionFromUserMiddleware = getRemoveSubscriptionFromUserMiddleware(
        userModel as any
      );

      await removeSubscriptionFromUserMiddleware(request, response, next);

      expect(findByIdAndUpdate).toBeCalledWith(id, {
        $set: { "stripe.subscription": undefined }
      });
      expect(response.locals.updatedUser).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with RemoveSubscriptionFromUserMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const removeSubscriptionFromUserMiddleware = getRemoveSubscriptionFromUserMiddleware(
        undefined as any
      );

      await removeSubscriptionFromUserMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.RemoveSubscriptionFromUserMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("setUserTypeToBasicMiddleware", () => {
    test("updates user model type to be basic", async () => {
      expect.assertions(2);
      const id = "id";
      const user = {
        id
      };
      const request: any = {};
      const response: any = {
        locals: {
          user
        }
      };
      const next = jest.fn();
      const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
      const userModel = {
        findByIdAndUpdate
      };
      const setUserTypeToBasicMiddleware = getSetUserTypeToBasicMiddleware(
        userModel as any,
        "basic" as any
      );

      await setUserTypeToBasicMiddleware(request, response, next);

      expect(findByIdAndUpdate).toBeCalledWith(id, { $set: { type: "basic" } });
      expect(next).toBeCalledWith();
    });

    test("calls next with SetUserTypeToBasicMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const userModel: any = {};
      const setUserTypeToBasicMiddleware = getSetUserTypeToBasicMiddleware(
        userModel,
        "basic" as any
      );

      await setUserTypeToBasicMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SetUserTypeToBasicMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("sendSuccessfullyRemovedSubscriptionMiddleware", () => {
    test("sends stripeCustomer and subscription information in response", () => {
      expect.assertions(1);
      const status = jest.fn();
      const request: any = {};
      const response: any = {
        status
      };
      const next = jest.fn();

      sendSuccessfullyRemovedSubscriptionMiddleware(request, response, next);

      expect(status).toBeCalledWith(204);
    });

    test("calls next with SendSuccessfulSubscriptionMiddleware on middleware failure", () => {
      expect.assertions(1);
      const request: any = {};
      const response = undefined as any;
      const next = jest.fn();

      sendSuccessfullyRemovedSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SendSuccessfulSubscriptionMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  test("are defined in the correct order", () => {
    expect.assertions(7);

    expect(cancelStripeCustomerSubscriptionMiddlewares.length).toEqual(6);
    expect(cancelStripeCustomerSubscriptionMiddlewares[0]).toBe(
      cancelStripeCustomerSubscriptionBodyValidationMiddleware
    );
    expect(cancelStripeCustomerSubscriptionMiddlewares[1]).toBe(
      doesUserHaveStripeSubscriptionMiddleware
    );
    expect(cancelStripeCustomerSubscriptionMiddlewares[2]).toBe(
      cancelStripeSubscriptionMiddleware
    );
    expect(cancelStripeCustomerSubscriptionMiddlewares[3]).toBe(
      removeSubscriptionFromUserMiddleware
    );
    expect(cancelStripeCustomerSubscriptionMiddlewares[4]).toBe(
      setUserTypeToBasicMiddleware
    );
    expect(cancelStripeCustomerSubscriptionMiddlewares[5]).toBe(
      sendSuccessfullyRemovedSubscriptionMiddleware
    );
  });
});